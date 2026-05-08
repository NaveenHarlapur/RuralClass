import { NextRequest, NextResponse } from "next/server"

// Mock notes data
const mockNotes = [
  {
    id: "1",
    title: "Introduction to Trees",
    course: "Data Structures & Algorithms",
    description: "Binary trees, traversals, and applications",
    fileType: "pdf",
    fileSize: "2.4 MB",
    downloadUrl: "/notes/trees.pdf",
    uploadedAt: "2026-05-01T10:00:00Z",
    uploadedBy: "Dr. Rajesh Kumar",
    downloads: 145,
    isOfflineAvailable: true,
  },
  {
    id: "2",
    title: "SQL Fundamentals",
    course: "Database Management Systems",
    description: "Basic SQL queries, joins, and subqueries",
    fileType: "pdf",
    fileSize: "1.8 MB",
    downloadUrl: "/notes/sql.pdf",
    uploadedAt: "2026-04-28T14:30:00Z",
    uploadedBy: "Prof. Meera Patel",
    downloads: 203,
    isOfflineAvailable: true,
  },
  {
    id: "3",
    title: "Process Management Video",
    course: "Operating Systems",
    description: "Video lecture on process scheduling",
    fileType: "video",
    fileSize: "156 MB",
    downloadUrl: "/notes/process-mgmt.mp4",
    uploadedAt: "2026-04-25T09:15:00Z",
    uploadedBy: "Dr. Anil Sharma",
    downloads: 89,
    isOfflineAvailable: false,
    duration: "45:30",
  },
  {
    id: "4",
    title: "OSI Model Explained",
    course: "Computer Networks",
    description: "Detailed explanation of all 7 layers",
    fileType: "pdf",
    fileSize: "3.2 MB",
    downloadUrl: "/notes/osi.pdf",
    uploadedAt: "2026-04-22T16:00:00Z",
    uploadedBy: "Prof. Sunita Verma",
    downloads: 167,
    isOfflineAvailable: true,
  },
  {
    id: "5",
    title: "React Hooks Tutorial",
    course: "Web Development",
    description: "useState, useEffect, and custom hooks",
    fileType: "video",
    fileSize: "234 MB",
    downloadUrl: "/notes/react-hooks.mp4",
    uploadedAt: "2026-04-20T11:45:00Z",
    uploadedBy: "Mr. Vikram Singh",
    downloads: 312,
    isOfflineAvailable: false,
    duration: "1:12:45",
  },
  {
    id: "6",
    title: "Graph Algorithms Cheatsheet",
    course: "Data Structures & Algorithms",
    description: "BFS, DFS, Dijkstra, and more",
    fileType: "pdf",
    fileSize: "890 KB",
    downloadUrl: "/notes/graphs.pdf",
    uploadedAt: "2026-04-18T08:30:00Z",
    uploadedBy: "Dr. Rajesh Kumar",
    downloads: 256,
    isOfflineAvailable: true,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const course = searchParams.get("course")
  const fileType = searchParams.get("fileType")
  const search = searchParams.get("search")
  const offlineOnly = searchParams.get("offlineOnly") === "true"

  let filteredNotes = [...mockNotes]

  if (course) {
    filteredNotes = filteredNotes.filter((n) => n.course === course)
  }

  if (fileType) {
    filteredNotes = filteredNotes.filter((n) => n.fileType === fileType)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredNotes = filteredNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(searchLower) ||
        n.description.toLowerCase().includes(searchLower) ||
        n.course.toLowerCase().includes(searchLower)
    )
  }

  if (offlineOnly) {
    filteredNotes = filteredNotes.filter((n) => n.isOfflineAvailable)
  }

  return NextResponse.json({
    success: true,
    notes: filteredNotes,
    total: filteredNotes.length,
  })
}
