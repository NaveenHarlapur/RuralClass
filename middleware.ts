import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_dev_only_change_in_prod"
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  // Authentication middleware disabled to allow for local localStorage-based auth
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*", "/register"],
}
