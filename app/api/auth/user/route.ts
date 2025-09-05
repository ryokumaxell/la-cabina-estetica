import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
