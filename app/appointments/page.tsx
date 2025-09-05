import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppointmentsCalendar } from "@/components/appointments/appointments-calendar"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-purple-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-900 mb-2">Gestión de Citas</h1>
              <p className="text-purple-600">Programa y administra las citas de tus clientes</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/appointments/new">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Calendario
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <AppointmentsCalendar />
            </TabsContent>

            <TabsContent value="list">
              <AppointmentsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
