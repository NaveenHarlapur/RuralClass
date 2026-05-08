import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

async function getAuthenticatedTeacherId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true }
  })

  if (!user || user.role !== 'teacher') return null
  return user.id
}

export async function GET() {
  const teacherId = await getAuthenticatedTeacherId()
  if (!teacherId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const materials = await prisma.note.findMany({
      where: { course: { teacherId } },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(materials)
  } catch (error) {
    console.error('Fetch materials error:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const teacherId = await getAuthenticatedTeacherId()
  if (!teacherId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, subject, courseId: rawCourseId, size, type, status, url, offline } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!subject && !rawCourseId) {
      return NextResponse.json({ error: 'Please select a subject / course' }, { status: 400 })
    }

    // Resolve courseId from subject name or use provided id
    let courseId = rawCourseId as string | null

    if (!courseId && subject) {
      const matched = await prisma.course.findFirst({
        where: { title: subject, teacherId }
      })

      if (!matched) {
        // Auto-create the course so uploads always succeed
        const created = await prisma.course.create({
          data: {
            title: subject,
            description: `${subject} course`,
            teacherId,
          }
        })
        courseId = created.id
      } else {
        courseId = matched.id
      }
    }

    // Ownership check
    const course = await prisma.course.findUnique({ where: { id: courseId! } })
    if (!course || course.teacherId !== teacherId) {
      return NextResponse.json({ error: 'Unauthorized course' }, { status: 403 })
    }

    const material = await prisma.note.create({
      data: {
        title,
        description: description || null,
        courseId: courseId!,
        size: size || '—',
        type: type || 'pdf',
        status: status || 'published',
        url: url || '',
        offline: offline || false,
      },
      include: { course: true }
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Upload material error:', error)
    return NextResponse.json({ error: 'Failed to upload material' }, { status: 500 })
  }
}
