import { NextRequest, NextResponse } from "next/server"

// Mock announcements data
const mockAnnouncements = [
  {
    id: "1",
    title: "Mid-Semester Exam Schedule Released",
    content: "The mid-semester examination schedule has been released. Please check the academic calendar for your exam dates. All exams will be conducted in hybrid mode with both online and offline options available.",
    type: "important",
    author: "Academic Office",
    authorAvatar: "/avatars/admin.jpg",
    createdAt: "2026-05-06T09:00:00Z",
    isPinned: true,
    attachments: ["exam_schedule.pdf"],
    readBy: 234,
  },
  {
    id: "2",
    title: "New Course Materials Available",
    content: "Updated study materials for Data Structures and Algorithms have been uploaded. The new materials include practice problems and video explanations for complex topics.",
    type: "course",
    author: "Dr. Rajesh Kumar",
    authorAvatar: "/avatars/teacher-2.jpg",
    course: "Data Structures & Algorithms",
    createdAt: "2026-05-05T14:30:00Z",
    isPinned: false,
    attachments: [],
    readBy: 156,
  },
  {
    id: "3",
    title: "Holiday Notice: Buddha Purnima",
    content: "The college will remain closed on May 12th, 2026 on account of Buddha Purnima. Regular classes will resume on May 13th.",
    type: "holiday",
    author: "Administrative Office",
    authorAvatar: "/avatars/admin.jpg",
    createdAt: "2026-05-04T10:00:00Z",
    isPinned: true,
    attachments: [],
    readBy: 312,
  },
  {
    id: "4",
    title: "Guest Lecture: AI in Education",
    content: "We are pleased to announce a guest lecture on 'Artificial Intelligence in Education' by Dr. Sundar Pichai from Google. The lecture will be held on May 15th at 3:00 PM via video conference.",
    type: "event",
    author: "Computer Science Department",
    authorAvatar: "/avatars/dept.jpg",
    createdAt: "2026-05-03T16:45:00Z",
    isPinned: false,
    attachments: ["lecture_details.pdf"],
    readBy: 189,
  },
  {
    id: "5",
    title: "Library Timing Update",
    content: "The college library will have extended hours during the examination period. New timings: 8:00 AM to 10:00 PM. Digital library resources remain available 24/7.",
    type: "general",
    author: "Library",
    authorAvatar: "/avatars/library.jpg",
    createdAt: "2026-05-02T11:30:00Z",
    isPinned: false,
    attachments: [],
    readBy: 145,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const pinnedOnly = searchParams.get("pinnedOnly") === "true"

  let filteredAnnouncements = [...mockAnnouncements]

  if (type) {
    filteredAnnouncements = filteredAnnouncements.filter((a) => a.type === type)
  }

  if (pinnedOnly) {
    filteredAnnouncements = filteredAnnouncements.filter((a) => a.isPinned)
  }

  // Sort by pinned first, then by date
  filteredAnnouncements.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return NextResponse.json({
    success: true,
    announcements: filteredAnnouncements,
    total: filteredAnnouncements.length,
  })
}
