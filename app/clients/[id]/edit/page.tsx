import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClientEditForm } from "@/components/clients/client-edit-form"

interface ClientEditPageProps {
  params: {
    id: string
  }
}

export default async function ClientEditPage({ params }: ClientEditPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch client data
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (clientError || !client) {
    redirect("/clients")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-rose-900 mb-2">
              Editar Cliente: {client.first_name} {client.last_name}
            </h1>
            <p className="text-rose-600">Actualiza la información del cliente</p>
          </div>

          <ClientEditForm client={client} />
        </div>
      </main>
    </div>
  )
}
