import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')?.toLowerCase()

    // Fetch all courses with teacher info and enrollment counts
    const courses = await prisma.course.findMany({
      where: {
        ...(category ? { description: { contains: category } } : {}), // Simple category filter via description for now
      },
      include: {
        teacher: {
          select: { id: true, name: true }
        },
        _count: {
          select: { enrollments: true, notes: true, assignments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const filtered = search
      ? courses.filter(c => 
          c.title.toLowerCase().includes(search) || 
          c.description?.toLowerCase().includes(search) ||
          c.teacher.name.toLowerCase().includes(search)
        )
      : courses

    const result = filtered.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      instructor: c.teacher.name,
      students: c._count.enrollments,
      lessons: c._count.notes + c._count.assignments,
      createdAt: c.createdAt,
    }))

    return NextResponse.json({
      success: true,
      courses: result,
      total: result.length,
    })
  } catch (error) {
    console.error('Fetch courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
