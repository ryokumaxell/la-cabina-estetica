import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login attempt started")
    const { email, password } = await request.json()
    console.log("[v0] Login data received:", { email, password: "***" })

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const { user, error } = await signIn(email, password)
    console.log("[v0] SignIn result:", { user: user ? "found" : "not found", error })

    if (error || !user) {
      console.log("[v0] Login failed:", error)
      return NextResponse.json({ error: error || "Credenciales inválidas" }, { status: 401 })
    }

    console.log("[v0] Login successful, user:", user.email)
    const response = NextResponse.json({ user, success: true }, { status: 200 })

    // Set cookie in response headers as well
    response.cookies.set(
      "auth-session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      },
    )

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
