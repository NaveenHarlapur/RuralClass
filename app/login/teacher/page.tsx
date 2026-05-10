"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Eye, EyeOff, ArrowLeft, Users, Shield } from "lucide-react"

export default function TeacherLoginPage() {
  const router = useRouter()
  const { } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [validationError, setValidationError] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, email: value })
    
    // Simple email validation
    if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setValidationError("Please enter a valid email address")
    } else {
      setValidationError("")
    }
  }

  const isSubmitDisabled = isLoading || !formData.email || !formData.password || validationError !== ""

  const { refreshUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setError("")
    
    try {
      // Bypassing all authentication logic as requested
      const mockUser = {
        full_name: formData.email.split('@')[0] || "Professor User",
        email: formData.email || "teacher@example.com",
        phone: "9876543210",
        role: "teacher",
        college: "Rural Arts College Nagpur",
        language: "en"
      };

      // Set session locally
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(mockUser));

      // Update global state
      refreshUser();

      // Redirect immediately
      window.location.href = "/dashboard/teacher";
    } catch (err: any) {
      console.log("[Login] Bypass error:", err);
      setError("Login failed.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-4 backdrop-blur sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">RuralClass</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
              <Users className="h-7 w-7 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Teacher Login</CardTitle>
            <CardDescription>
              Access your teaching dashboard and manage your classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email address"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                />
                {validationError && (
                  <p className="text-xs text-destructive mt-1">{validationError}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Secure encrypted connection
                </span>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitDisabled}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Contact Administration
              </Link>
            </p>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Are you a student?{" "}
              <Link href="/login/student" className="text-primary hover:underline">
                Student Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
