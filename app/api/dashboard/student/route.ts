import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                teacher: true,
                assignments: {
                  orderBy: { dueDate: 'asc' }
                },
                notes: {
                  orderBy: { createdAt: 'desc' }
                },
              }
            }
          }
        },
        submissions: {
          include: {
            assignment: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const courses = user.enrollments.map(e => ({
      ...e.course,
      progress: e.progress
    }))

    const courseIds = courses.map(c => c.id)

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { courseId: null },
          { courseId: { in: courseIds } }
        ]
      },
      include: {
        author: true,
        course: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      courses,
      announcements,
      submissions: user.submissions
    })

  } catch (error) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
