"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Download,
  FileText,
  Bell,
  TrendingUp,
  MessageSquare,
  WifiOff,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Upload,
  ClipboardList,
  BarChart3,
  Calendar,
  Bot,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  role: "student" | "teacher"
}

const studentNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/student" },
  { icon: BookOpen, label: "Study Notes", href: "/dashboard/student/notes" },
  { icon: FileText, label: "Assignments", href: "/dashboard/student/assignments" },
  { icon: Bot, label: "AI Tools", href: "/dashboard/student/ai-tools" },
  { icon: Download, label: "Downloads", href: "/dashboard/student/downloads" },
  { icon: Bell, label: "Announcements", href: "/dashboard/student/announcements" },
  { icon: TrendingUp, label: "Progress", href: "/dashboard/student/progress" },
  { icon: MessageSquare, label: "Discussions", href: "/dashboard/student/discussions" },
  { icon: WifiOff, label: "Offline Content", href: "/dashboard/student/offline" },
]

const teacherNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/teacher" },
  { icon: Upload, label: "Upload Content", href: "/dashboard/teacher/upload" },
  { icon: FileText, label: "Assignments", href: "/dashboard/teacher/assignments" },
  { icon: Bell, label: "Announcements", href: "/dashboard/teacher/announcements" },
  { icon: ClipboardList, label: "Submissions", href: "/dashboard/teacher/submissions" },
  { icon: Calendar, label: "Attendance", href: "/dashboard/teacher/attendance" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/teacher/analytics" },
  { icon: Users, label: "Students", href: "/dashboard/teacher/students" },
]

export function DashboardSidebar({ collapsed, onToggle, role }: SidebarProps) {
  const pathname = usePathname()
  const navItems = role === "student" ? studentNavItems : teacherNavItems

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 transition-opacity",
            collapsed && "opacity-0"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">
            RuralClass
          </span>
        </Link>
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 transition-colors",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Link href={role === "student" ? "/dashboard/student/settings" : "/dashboard/teacher/settings"}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed && "justify-center px-2"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </Link>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mt-2 w-full text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  )
}
