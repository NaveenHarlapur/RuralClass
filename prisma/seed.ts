import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up existing data to prevent conflicts
  await prisma.reply.deleteMany()
  await prisma.discussion.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.note.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Teacher
  const hashedTeacherPassword = await bcrypt.hash('teacher123', 10)
  const teacher = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@faculty.edu',
      phone: '0987654321',
      password: hashedTeacherPassword,
      role: 'teacher',
      college: 'Government College, Rajasthan',
      department: 'Computer Science',
    },
  })
  console.log('Created teacher user')

  // 2. Create Student
  const hashedStudentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.create({
    data: {
      name: 'Rahul Kumar',
      email: 'rahul.kumar@student.edu',
      phone: '1234567890',
      password: hashedStudentPassword,
      role: 'student',
      college: 'Government College, Pune',
      department: 'Computer Science',
    },
  })
  console.log('Created student user')

  // 3. Create Technical Courses
  const technicalCourses = [
    'C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'PHP',
    'Data Structures and Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks',
    'OOPS', 'Software Engineering', 'Compiler Design', 'Theory of Computation',
    'Machine Learning', 'Artificial Intelligence', 'Cyber Security', 'Cloud Computing',
    'Full Stack Development', 'Web Development', 'Mobile App Development', 'Data Science',
    'DevOps', 'System Design', 'Distributed Systems', 'UI/UX Design'
  ]

  const createdCourses = []
  for (const title of technicalCourses) {
    const course = await prisma.course.create({
      data: {
        title,
        description: `${title} fundamentals and advanced concepts.`,
        teacherId: teacher.id,
      },
    })
    createdCourses.push(course)
  }
  console.log(`Created ${createdCourses.length} technical courses`)

  // 4. Enroll Student in some courses
  const studentEnrollments = createdCourses.slice(0, 5)
  for (const course of studentEnrollments) {
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        progress: Math.floor(Math.random() * 100),
      },
    })
  }
  console.log('Created enrollments')

  // 5. Create some initial notes
  const dsaCourse = createdCourses.find(c => c.title === 'Data Structures and Algorithms')
  if (dsaCourse) {
    await prisma.note.create({
      data: {
        title: 'Introduction to Linked Lists',
        description: 'Basics of singly and doubly linked lists.',
        courseId: dsaCourse.id,
        size: '1.2 MB',
        type: 'pdf',
        status: 'published',
        offline: true,
      },
    })
  }
  console.log('Created initial notes')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
