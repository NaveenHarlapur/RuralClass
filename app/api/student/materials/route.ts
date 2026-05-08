import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseFilter = searchParams.get('course')
    const search = searchParams.get('search')?.toLowerCase()

    // Fetch all published notes from all teachers
    const notes = await prisma.note.findMany({
      where: {
        status: 'published',
        ...(courseFilter ? { course: { title: courseFilter } } : {}),
      },
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    // Apply search filter in JS (case-insensitive on title)
    const filtered = search
      ? notes.filter(n =>
          n.title.toLowerCase().includes(search) ||
          n.course.title.toLowerCase().includes(search)
        )
      : notes

    // Shape the response for the student
    const materials = filtered.map(note => ({
      id: note.id,
      title: note.title,
      description: note.description,
      subject: note.course.title,
      teacherName: note.course.teacher.name,
      uploadDate: note.createdAt,
      type: note.type || 'pdf',
      size: note.size,
      url: note.url,
      offline: note.offline,
    }))

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Student materials fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}
