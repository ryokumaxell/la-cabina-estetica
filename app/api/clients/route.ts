import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

// Mock data for clients
const mockClients = [
  {
    id: "1",
    first_name: "María",
    last_name: "González",
  },
  {
    id: "2",
    first_name: "Ana",
    last_name: "Martínez",
  },
  {
    id: "3",
    first_name: "Carmen",
    last_name: "López",
  },
]

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // In a real app, fetch from database with user_id filter
    return NextResponse.json(mockClients, { status: 200 })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
