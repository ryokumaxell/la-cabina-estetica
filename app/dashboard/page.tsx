import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentClients } from "@/components/dashboard/recent-clients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { BusinessAnalytics } from "@/components/dashboard/business-analytics"

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-purple-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Panel de Control</h1>
            <p className="text-purple-600">Gestiona tu práctica estética de manera profesional</p>
          </div>

          <DashboardStats />

          <div className="grid gap-8 md:grid-cols-2">
            <RecentClients />
            <UpcomingAppointments />
          </div>

          <BusinessAnalytics />
        </div>
      </main>
    </div>
  )
}
