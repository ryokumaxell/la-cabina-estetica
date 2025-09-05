import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

// Mock data for treatments (replace with actual database queries)
const mockTreatments = [
  {
    id: "1",
    treatment_date: "2024-01-15T10:00:00Z",
    treatment_details: "Limpieza facial profunda con extracción de comedones y aplicación de mascarilla hidratante",
    clients: {
      first_name: "María",
      last_name: "González",
    },
    procedures: {
      name: "Limpieza Facial Profunda",
      category: "Facial",
    },
  },
  {
    id: "2",
    treatment_date: "2024-01-20T14:30:00Z",
    treatment_details: "Tratamiento anti-edad con radiofrecuencia y aplicación de sérum con ácido hialurónico",
    clients: {
      first_name: "Ana",
      last_name: "Martínez",
    },
    procedures: {
      name: "Radiofrecuencia Facial",
      category: "Anti-edad",
    },
  },
]

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // In a real app, fetch from database with user_id filter
    return NextResponse.json(mockTreatments, { status: 200 })
  } catch (error) {
    console.error("Error fetching treatments:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
