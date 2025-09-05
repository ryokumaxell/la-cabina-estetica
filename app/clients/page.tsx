import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClientsTable } from "@/components/clients/clients-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ClientsPage() {
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
              <h1 className="text-3xl font-bold text-purple-900 mb-2">Gestión de Clientes</h1>
              <p className="text-purple-600">Administra la información de tus clientes</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/clients/new">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Link>
            </Button>
          </div>

          <ClientsTable />
        </div>
      </main>
    </div>
  )
}
