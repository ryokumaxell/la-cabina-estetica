import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClientProfile } from "@/components/clients/client-profile"
import { TreatmentHistory } from "@/components/treatments/treatment-history"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

interface ClientPageProps {
  params: {
    id: string
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-rose-600 hover:text-rose-700">
                <Link href="/clients">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Clientes
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-rose-900">
                  {client.first_name} {client.last_name}
                </h1>
                <p className="text-rose-600">Perfil del cliente e historial de tratamientos</p>
              </div>
            </div>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href={`/clients/${client.id}/treatments/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Tratamiento
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ClientProfile client={client} />
            </div>
            <div className="lg:col-span-2">
              <TreatmentHistory clientId={client.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
