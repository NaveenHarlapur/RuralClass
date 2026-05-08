import { jwtVerify, SignJWT } from "jose"

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_dev_only_change_in_prod"
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: { userId: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())
    return payload as { userId: string; role: string; iat: number; exp: number }
  } catch (error) {
    return null
  }
}
