// MongoDB-Compatible Data Models
// These interfaces define the structure for all data entities

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Hashed, never exposed to frontend
  role: "student" | "teacher" | "admin";
  avatar?: string;
  college: string;
  department: string;
  enrollmentNumber?: string; // For students
  employeeId?: string; // For teachers
  phone?: string;
  preferredLanguage: string;
  dataSaverMode: boolean;
  offlineMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: number;
  chapter?: string;
  fileUrl: string;
  fileSize: number;
  fileType: "pdf" | "doc" | "ppt" | "video" | "audio";
  compressedUrl?: string; // Low-bandwidth version
  thumbnailUrl?: string;
  uploadedBy: string; // User ID
  uploadedByName: string;
  college: string;
  department: string;
  downloadCount: number;
  isOfflineAvailable: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: number;
  dueDate: Date;
  maxMarks: number;
  attachmentUrl?: string;
  createdBy: string; // Teacher User ID
  createdByName: string;
  college: string;
  department: string;
  submissionCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  _id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileUrl: string;
  fileSize: number;
  submittedAt: Date;
  status: "submitted" | "graded" | "late" | "resubmitted";
  marks?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface Attendance {
  _id: string;
  date: Date;
  subject: string;
  semester: number;
  college: string;
  department: string;
  markedBy: string; // Teacher User ID
  students: {
    studentId: string;
    studentName: string;
    status: "present" | "absent" | "late";
  }[];
  createdAt: Date;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  topic: string;
  subject?: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "teacher";
  authorAvatar?: string;
  college: string;
  department: string;
  replies: {
    _id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorRole: "student" | "teacher";
    authorAvatar?: string;
    createdAt: Date;
  }[];
  likes: string[]; // User IDs
  isResolved: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  type: "general" | "academic" | "event" | "exam" | "holiday";
  authorId: string;
  authorName: string;
  college: string;
  department?: string; // Optional, for department-specific announcements
  targetAudience: "all" | "students" | "teachers";
  attachmentUrl?: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfflineContent {
  _id: string;
  userId: string;
  contentType: "note" | "assignment" | "video";
  contentId: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  downloadedAt: Date;
  lastAccessedAt: Date;
  syncStatus: "synced" | "pending" | "failed";
}

export interface Progress {
  _id: string;
  studentId: string;
  subject: string;
  semester: number;
  completedLessons: number;
  totalLessons: number;
  completedAssignments: number;
  totalAssignments: number;
  averageMarks: number;
  attendancePercentage: number;
  lastActivityAt: Date;
  updatedAt: Date;
}

export interface AIConversation {
  _id: string;
  userId: string;
  messages: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    subject?: string;
  }[];
  subject?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}
