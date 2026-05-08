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
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [validationError, setValidationError] = useState("")

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const isOnlyDigits = /^\d+$/.test(value)
    
    if (isOnlyDigits && value.length > 10) {
      setValidationError("Phone number cannot exceed 10 digits")
      const truncated = value.slice(0, 10)
      e.target.value = truncated
      setFormData({ ...formData, email: truncated })
      return
    }
    
    if (value.length === 0) {
      setValidationError("")
    } else if (isOnlyDigits) {
      if (value.length < 10) {
        setValidationError("Phone number must be exactly 10 digits")
      } else {
        setValidationError("")
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setValidationError("Please enter a valid email address")
      } else {
        setValidationError("")
      }
    }

    setFormData({ ...formData, email: value })
  }

  const isValidPhone = /^\d{10}$/.test(formData.email)
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  const isSubmitDisabled = isLoading || (!isValidPhone && !isValidEmail)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const result = await login(formData.email, formData.password, "teacher")
    setIsLoading(false)
    
    if (result.success) {
      router.push("/dashboard/teacher")
    } else {
      setError(result.error || "Invalid email or password")
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
                <Label htmlFor="email">Email or Phone Number</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter Email or 10-digit Phone Number"
                  value={formData.email}
                  onChange={handleIdentifierChange}
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
