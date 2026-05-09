import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: Request) {
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

    const { courseId } = await req.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: {
        studentId: payload.userId,
        courseId: courseId
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 })
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: payload.userId,
        courseId: courseId,
        progress: 0,
        status: 'active'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Enrolled successfully',
      enrollment
    })

  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }
}
