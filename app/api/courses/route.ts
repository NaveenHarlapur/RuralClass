import { NextRequest, NextResponse } from "next/server"

// Mock courses data
const mockCourses = [
  {
    id: "1",
    title: "Data Structures & Algorithms",
    description: "Comprehensive course on DSA fundamentals",
    instructor: "Dr. Rajesh Kumar",
    thumbnail: "/courses/dsa.jpg",
    duration: "12 weeks",
    lessons: 48,
    students: 156,
    rating: 4.8,
    progress: 65,
    category: "Computer Science",
    level: "Intermediate",
    language: "Hindi",
  },
  {
    id: "2",
    title: "Database Management Systems",
    description: "Learn SQL, NoSQL, and database design",
    instructor: "Prof. Meera Patel",
    thumbnail: "/courses/dbms.jpg",
    duration: "10 weeks",
    lessons: 40,
    students: 203,
    rating: 4.6,
    progress: 42,
    category: "Computer Science",
    level: "Beginner",
    language: "Hindi",
  },
  {
    id: "3",
    title: "Operating Systems",
    description: "Deep dive into OS concepts and Linux",
    instructor: "Dr. Anil Sharma",
    thumbnail: "/courses/os.jpg",
    duration: "14 weeks",
    lessons: 56,
    students: 134,
    rating: 4.7,
    progress: 30,
    category: "Computer Science",
    level: "Advanced",
    language: "English",
  },
  {
    id: "4",
    title: "Computer Networks",
    description: "Networking fundamentals and protocols",
    instructor: "Prof. Sunita Verma",
    thumbnail: "/courses/networks.jpg",
    duration: "11 weeks",
    lessons: 44,
    students: 189,
    rating: 4.5,
    progress: 78,
    category: "Computer Science",
    level: "Intermediate",
    language: "Hindi",
  },
  {
    id: "5",
    title: "Web Development",
    description: "Full-stack web development with React and Node.js",
    instructor: "Mr. Vikram Singh",
    thumbnail: "/courses/web.jpg",
    duration: "16 weeks",
    lessons: 64,
    students: 278,
    rating: 4.9,
    progress: 55,
    category: "Development",
    level: "Beginner",
    language: "Hindi",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const level = searchParams.get("level")
  const search = searchParams.get("search")

  let filteredCourses = [...mockCourses]

  if (category) {
    filteredCourses = filteredCourses.filter((c) => c.category === category)
  }

  if (level) {
    filteredCourses = filteredCourses.filter((c) => c.level === level)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCourses = filteredCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.instructor.toLowerCase().includes(searchLower)
    )
  }

  return NextResponse.json({
    success: true,
    courses: filteredCourses,
    total: filteredCourses.length,
  })
}
