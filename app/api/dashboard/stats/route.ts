import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Mock data - in a real app, fetch from database
    const stats = {
      totalClients: 47,
      todayAppointments: 8,
      monthlyRevenue: 3250.0,
      growthPercentage: 12.5,
    }

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
