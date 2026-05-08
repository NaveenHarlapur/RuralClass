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
    const courses = await prisma.course.findMany({
      where: { teacherId },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Fetch courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
