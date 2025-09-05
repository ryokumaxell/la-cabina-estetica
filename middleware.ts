import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("auth-session")
  const { pathname } = request.nextUrl

  // Allow access to auth pages and API routes
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Redirect to login if no session and trying to access protected routes
  if (!session && pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect to dashboard if logged in and trying to access home page
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
