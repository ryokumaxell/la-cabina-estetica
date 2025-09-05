import { cookies } from "next/headers"
import users from "./users.json"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  console.log("[v0] SignIn function called with email:", email)
  const user = users.users.find((u) => u.email === email && u.password === password)
  console.log("[v0] User found in database:", user ? "yes" : "no")

  if (!user) {
    return { user: null, error: "Credenciales inválidas" }
  }

  try {
    const cookieStore = cookies()
    const sessionData = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    console.log("[v0] Setting cookie with data:", sessionData)

    cookieStore.set("auth-session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Cookie set successfully")
  } catch (error) {
    console.error("[v0] Error setting cookie:", error)
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    error: null,
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("auth-session")
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("auth-session")

    if (!session) {
      return null
    }

    const user = JSON.parse(session.value)
    return user
  } catch {
    return null
  }
}

export function getUserClient(): User | null {
  if (typeof window === "undefined") return null

  try {
    const session = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-session="))
      ?.split("=")[1]

    if (!session) return null

    return JSON.parse(decodeURIComponent(session))
  } catch {
    return null
  }
}
