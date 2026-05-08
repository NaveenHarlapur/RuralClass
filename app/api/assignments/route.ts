import { NextRequest, NextResponse } from "next/server"

// Mock assignments data
const mockAssignments = [
  {
    id: "1",
    title: "Implement Binary Search Tree",
    course: "Data Structures & Algorithms",
    description: "Implement a BST with insert, delete, and search operations",
    dueDate: "2026-05-15T23:59:59Z",
    status: "pending",
    maxScore: 100,
    submittedAt: null,
    score: null,
    attachments: ["bst_requirements.pdf"],
  },
  {
    id: "2",
    title: "Database Normalization Exercise",
    course: "Database Management Systems",
    description: "Normalize the given database schema to 3NF",
    dueDate: "2026-05-12T23:59:59Z",
    status: "submitted",
    maxScore: 50,
    submittedAt: "2026-05-10T14:30:00Z",
    score: null,
    attachments: ["schema.png", "instructions.pdf"],
  },
  {
    id: "3",
    title: "Process Scheduling Simulation",
    course: "Operating Systems",
    description: "Simulate FCFS, SJF, and Round Robin scheduling",
    dueDate: "2026-05-08T23:59:59Z",
    status: "graded",
    maxScore: 100,
    submittedAt: "2026-05-07T18:45:00Z",
    score: 92,
    feedback: "Excellent work! Good implementation of all algorithms.",
    attachments: ["simulation_guide.pdf"],
  },
  {
    id: "4",
    title: "Network Protocol Analysis",
    course: "Computer Networks",
    description: "Analyze TCP/IP packet captures using Wireshark",
    dueDate: "2026-05-20T23:59:59Z",
    status: "pending",
    maxScore: 75,
    submittedAt: null,
    score: null,
    attachments: ["capture_file.pcap", "analysis_template.docx"],
  },
  {
    id: "5",
    title: "React Todo App",
    course: "Web Development",
    description: "Build a fully functional todo application using React",
    dueDate: "2026-05-18T23:59:59Z",
    status: "pending",
    maxScore: 100,
    submittedAt: null,
    score: null,
    attachments: ["requirements.md"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const course = searchParams.get("course")

  let filteredAssignments = [...mockAssignments]

  if (status) {
    filteredAssignments = filteredAssignments.filter((a) => a.status === status)
  }

  if (course) {
    filteredAssignments = filteredAssignments.filter((a) => a.course === course)
  }

  return NextResponse.json({
    success: true,
    assignments: filteredAssignments,
    total: filteredAssignments.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignmentId, file, comments } = body

    // Validate required fields
    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      )
    }

    // In production, handle file upload and save to database
    const submission = {
      id: Math.random().toString(36).substring(7),
      assignmentId,
      submittedAt: new Date().toISOString(),
      file: file || "submission.pdf",
      comments: comments || "",
      status: "submitted",
    }

    return NextResponse.json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
