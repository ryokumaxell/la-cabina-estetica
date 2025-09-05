import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Mock analytics data - in a real app, fetch from database with complex queries
    const analytics = {
      popularProcedures: [
        { name: "Limpieza Facial Profunda", count: 24, category: "Facial" },
        { name: "Radiofrecuencia Facial", count: 18, category: "Anti-edad" },
        { name: "Peeling Químico", count: 15, category: "Facial" },
        { name: "Mesoterapia", count: 12, category: "Corporal" },
        { name: "Hidratación Facial", count: 10, category: "Facial" },
      ],
      monthlyTrends: [
        { month: "Oct 2023", appointments: 45, revenue: 2800 },
        { month: "Nov 2023", appointments: 52, revenue: 3100 },
        { month: "Dec 2023", appointments: 38, revenue: 2400 },
        { month: "Ene 2024", appointments: 61, revenue: 3650 },
      ],
      clientSatisfaction: {
        averageRating: 4.8,
        totalReviews: 127,
      },
      businessMetrics: {
        averageSessionDuration: 75,
        clientRetentionRate: 85,
        bookingConversionRate: 92,
      },
    }

    return NextResponse.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
