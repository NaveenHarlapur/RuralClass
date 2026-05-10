"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Eye, EyeOff, ArrowLeft, Wifi, WifiOff } from "lucide-react"

export default function StudentLoginPage() {
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
        full_name: formData.email.split('@')[0] || "Student User",
        email: formData.email || "student@example.com",
        phone: "1234567890",
        role: "student",
        college: "Government College Pune",
        language: "en"
      };

      // Set session locally
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(mockUser));

      // Update global state
      refreshUser();

      // Redirect immediately
      window.location.href = "/dashboard/student";
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your learning dashboard
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

              {/* Connection Status */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <Wifi className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Connection: <span className="text-primary">Good</span>
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
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Are you a teacher?{" "}
              <Link href="/login/teacher" className="text-primary hover:underline">
                Teacher Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
