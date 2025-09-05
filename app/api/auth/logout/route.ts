import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth/auth"

export async function POST() {
  try {
    await signOut()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}
