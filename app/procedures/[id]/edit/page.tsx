import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProcedureEditForm } from "@/components/procedures/procedure-edit-form"

interface ProcedureEditPageProps {
  params: {
    id: string
  }
}

export default async function ProcedureEditPage({ params }: ProcedureEditPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch procedure data
  const { data: procedure, error: procedureError } = await supabase
    .from("procedures")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (procedureError || !procedure) {
    redirect("/procedures")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-rose-900 mb-2">Editar Procedimiento</h1>
            <p className="text-rose-600">Actualiza la información del procedimiento: {procedure.name}</p>
          </div>

          <ProcedureEditForm procedure={procedure} />
        </div>
      </main>
    </div>
  )
}
