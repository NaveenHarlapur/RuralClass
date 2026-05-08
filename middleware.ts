import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_dev_only_change_in_prod"
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login/student", request.url))
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey())
      
      // Role-based protection
      if (pathname.startsWith("/dashboard/student") && payload.role !== "student") {
        return NextResponse.redirect(new URL("/dashboard/teacher", request.url))
      }
      if (pathname.startsWith("/dashboard/teacher") && payload.role !== "teacher") {
        return NextResponse.redirect(new URL("/dashboard/student", request.url))
      }
      
      return NextResponse.next()
    } catch (error) {
      // Invalid token
      const response = NextResponse.redirect(new URL("/login/student", request.url))
      response.cookies.delete("auth_token")
      return response
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === "/login/student" || pathname === "/login/teacher" || pathname === "/register") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, getJwtSecretKey())
        return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url))
      } catch (error) {
        // Token invalid, let them stay on login
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*", "/register"],
}
