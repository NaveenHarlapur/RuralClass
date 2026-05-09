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

    const teacher = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        teachingCourses: {
          include: {
            enrollments: {
              include: {
                student: {
                  select: { id: true, name: true, email: true }
                }
              }
            },
            assignments: {
              include: {
                submissions: {
                  include: {
                    student: {
                      select: { id: true, name: true }
                    }
                  }
                }
              }
            },
            notes: {
              orderBy: { createdAt: 'desc' }
            },
            announcements: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ error: 'Teacher not found or unauthorized' }, { status: 404 })
    }

    // Fetch total registered students in the system
    const totalStudentsCount = await prisma.user.count({
      where: { role: 'student' }
    })

    // Fetch list of registered students
    const registeredStudents = await prisma.user.findMany({
      where: { role: 'student' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // Aggregate stats across all courses
    const courses = teacher.teachingCourses

    // Total materials uploaded
    const totalMaterials = courses.reduce((sum, c) => sum + c.notes.length, 0)

    // All pending submissions (for "Recent Submissions" panel)
    const recentSubmissions: any[] = []
    courses.forEach(course => {
      course.assignments.forEach(assignment => {
        assignment.submissions.forEach(sub => {
          recentSubmissions.push({
            id: sub.id,
            studentName: sub.student?.name || 'Student',
            assignmentName: assignment.title,
            courseName: course.title,
            submittedAt: sub.createdAt,
            status: sub.status,
          })
        })
      })
    })

    // Sort by newest first
    recentSubmissions.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )

    return NextResponse.json({
      courses,
      stats: {
        totalStudents: totalStudentsCount,
        totalCourses: courses.length,
        totalMaterials,
        totalSubmissions: recentSubmissions.length,
      },
      recentSubmissions: recentSubmissions.slice(0, 5),
      registeredStudents,
    })

  } catch (error) {
    console.error('Teacher dashboard fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
