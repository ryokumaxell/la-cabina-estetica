import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ReportsOverview } from "@/components/reports/reports-overview"

export default async function ReportsPage() {
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
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Registros Técnicos</h1>
            <p className="text-purple-600">Generar reportes profesionales de tratamientos y exportar a PDF</p>
          </div>

          <ReportsOverview />
        </div>
      </main>
    </div>
  )
}
