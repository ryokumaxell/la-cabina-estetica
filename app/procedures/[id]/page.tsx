import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProcedureDetails } from "@/components/procedures/procedure-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProcedurePageProps {
  params: {
    id: string
  }
}

export default async function ProcedurePage({ params }: ProcedurePageProps) {
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-rose-600 hover:text-rose-700">
              <Link href="/procedures">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Procedimientos
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-rose-900">{procedure.name}</h1>
              <p className="text-rose-600">Detalles del procedimiento</p>
            </div>
          </div>

          <ProcedureDetails procedure={procedure} />
        </div>
      </main>
    </div>
  )
}
