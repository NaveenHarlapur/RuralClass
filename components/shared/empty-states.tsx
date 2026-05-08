"use client";

import { Button } from "@/components/ui/button";
import {
  FileText,
  FolderOpen,
  MessageSquare,
  Bell,
  Search,
  Download,
  Upload,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  Plus,
} from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function EmptyNotes({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title="No notes yet"
      description="Notes from your courses will appear here. Download them for offline access or browse available content."
      action={onUpload ? { label: "Browse Notes", onClick: onUpload } : undefined}
    />
  );
}

export function EmptyAssignments({ onView }: { onView?: () => void }) {
  return (
    <EmptyState
      icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
      title="No assignments"
      description="You don't have any pending assignments. Check back later or browse completed assignments."
      action={onView ? { label: "View All", onClick: onView } : undefined}
    />
  );
}

export function EmptyDiscussions({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
      title="No discussions"
      description="Start a discussion to ask questions, share ideas, or collaborate with your classmates."
      action={onCreate ? { label: "Start Discussion", onClick: onCreate } : undefined}
    />
  );
}

export function EmptyAnnouncements() {
  return (
    <EmptyState
      icon={<Bell className="h-8 w-8 text-muted-foreground" />}
      title="No announcements"
      description="There are no announcements at the moment. Check back later for updates from your teachers."
    />
  );
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try different keywords or browse all content.`}
    />
  );
}

export function EmptyDownloads({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={<Download className="h-8 w-8 text-muted-foreground" />}
      title="No downloads"
      description="You haven't downloaded any content for offline access yet. Download notes and materials to study without internet."
      action={onBrowse ? { label: "Browse Content", onClick: onBrowse } : undefined}
    />
  );
}

export function EmptySubmissions() {
  return (
    <EmptyState
      icon={<Upload className="h-8 w-8 text-muted-foreground" />}
      title="No submissions"
      description="No students have submitted their assignments yet. Submissions will appear here once received."
    />
  );
}

export function EmptyStudents() {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-muted-foreground" />}
      title="No students"
      description="There are no students enrolled in this class yet. Students will appear here once they join."
    />
  );
}

export function EmptyFolder() {
  return (
    <EmptyState
      icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
      title="This folder is empty"
      description="There's nothing here yet. Upload files or create new content to get started."
    />
  );
}

export function EmptyCourses({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
      title="No courses enrolled"
      description="You're not enrolled in any courses yet. Browse available courses to start learning."
      action={onBrowse ? { label: "Browse Courses", onClick: onBrowse } : undefined}
    />
  );
}

export function EmptySchedule() {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
      title="No classes scheduled"
      description="You don't have any classes scheduled for today. Check your full schedule for upcoming classes."
    />
  );
}
