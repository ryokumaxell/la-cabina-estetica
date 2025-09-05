import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Mock data - in a real app, fetch from database
    const recentClients = [
      {
        id: "1",
        first_name: "María",
        last_name: "González",
        email: "maria.gonzalez@email.com",
        created_at: "2024-01-20T10:00:00Z",
      },
      {
        id: "2",
        first_name: "Ana",
        last_name: "Martínez",
        email: "ana.martinez@email.com",
        created_at: "2024-01-18T14:30:00Z",
      },
      {
        id: "3",
        first_name: "Carmen",
        last_name: "López",
        email: "carmen.lopez@email.com",
        created_at: "2024-01-15T09:15:00Z",
      },
      {
        id: "4",
        first_name: "Isabel",
        last_name: "Ruiz",
        email: "isabel.ruiz@email.com",
        created_at: "2024-01-12T16:45:00Z",
      },
    ]

    return NextResponse.json(recentClients, { status: 200 })
  } catch (error) {
    console.error("Error fetching recent clients:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
