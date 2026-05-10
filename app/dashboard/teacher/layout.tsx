"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("[Layout] No user found, redirecting to login...");
      router.replace("/login/teacher");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Loading Teacher Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center px-4">
        <h2 className="text-xl font-semibold">Session Required</h2>
        <p className="text-muted-foreground">Please sign in to access the teacher dashboard.</p>
        <div className="h-1.5 w-32 bg-primary/20 overflow-hidden rounded-full">
          <div className="h-full bg-primary animate-progress-indefinite" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          role="teacher"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative h-full w-64">
            <DashboardSidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
              role="teacher"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <DashboardHeader
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          userName={user?.name || "Teacher"}
          userRole={user?.department ? `Professor - ${user.department}` : "Teacher"}
        />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
