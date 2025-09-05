import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AppointmentPageProps {
  params: {
    id: string
  }
}

export default async function AppointmentPage({ params }: AppointmentPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch appointment data
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select(
      `
      *,
      clients (id, first_name, last_name, email, phone),
      procedures (id, name, category, description, duration_minutes, price)
    `,
    )
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (appointmentError || !appointment) {
    redirect("/appointments")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-rose-600 hover:text-rose-700">
              <Link href="/appointments">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Citas
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-rose-900">Detalles de la Cita</h1>
              <p className="text-rose-600">
                {appointment.clients.first_name} {appointment.clients.last_name} -{" "}
                {new Date(appointment.appointment_date).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>

          <AppointmentDetails appointment={appointment} />
        </div>
      </main>
    </div>
  )
}
