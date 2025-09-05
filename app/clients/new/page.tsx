import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClientForm } from "@/components/clients/client-form"

export default async function NewClientPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-rose-900 mb-2">Nuevo Cliente</h1>
            <p className="text-rose-600">Registra la información completa del cliente</p>
          </div>

          <ClientForm />
        </div>
      </main>
    </div>
  )
}
