import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

// Mock data for full treatment details
const mockFullTreatment = {
  id: "1",
  treatment_date: "2024-01-15T10:00:00Z",
  treatment_details: "Limpieza facial profunda con extracción de comedones y aplicación de mascarilla hidratante",
  pre_treatment_notes: "Piel mixta con tendencia grasa en zona T, presencia de comedones abiertos y cerrados",
  post_treatment_notes: "Piel limpia y purificada, ligero enrojecimiento que desaparecerá en 2-3 horas",
  products_used:
    "Gel limpiador con ácido salicílico, tónico astringente, mascarilla de arcilla verde, crema hidratante no comedogénica",
  next_appointment_recommendation: "Repetir tratamiento en 4 semanas, mantener rutina de limpieza diaria",
  clients: {
    first_name: "María",
    last_name: "González",
    email: "maria.gonzalez@email.com",
    phone: "+34 666 123 456",
    skin_type: "Mixta",
    allergies: "Ninguna conocida",
  },
  procedures: {
    name: "Limpieza Facial Profunda",
    category: "Facial",
    description:
      "Tratamiento de limpieza profunda que incluye extracción manual de impurezas y aplicación de mascarilla purificante",
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // In a real app, fetch from database with treatment ID and user_id filter
    return NextResponse.json(mockFullTreatment, { status: 200 })
  } catch (error) {
    console.error("Error fetching treatment:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
