import { DEFAULT_AUTH_SKIP_ROUTES } from "@neon/auth/server"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"

// The Neon middleware hardcodes its public-route list, so routes it would
// otherwise redirect to the login page are bypassed here before delegating.
const PUBLIC_ROUTES = [
  ...DEFAULT_AUTH_SKIP_ROUTES,
  "/",
  "/auth",
  "/auth/reset-password",
  "/auth/reset-link-sent",
  "/auth/verify-email",
  "/auth/error",
  "/auth/redirect",
  "/auth/sign-out",
  "/auth/magic-link-sent",
  "/auth/accept-invitation"
]

const neonMiddleware = auth.middleware({ loginUrl: "/auth/sign-in" })

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isPublic) return NextResponse.next()
  return neonMiddleware(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
