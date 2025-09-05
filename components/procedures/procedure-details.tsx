import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, FileText, AlertTriangle, Heart, CheckCircle, Edit } from "lucide-react"
import Link from "next/link"

interface Procedure {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  price: number | null
  category: string | null
  requirements: string | null
  contraindications: string | null
  aftercare_instructions: string | null
  active: boolean
  created_at: string
}

interface ProcedureDetailsProps {
  procedure: Procedure
}

export function ProcedureDetails({ procedure }: ProcedureDetailsProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Información Principal */}
        <Card className="border-rose-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-rose-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Información del Procedimiento
              </CardTitle>
              <CardDescription>Detalles principales del tratamiento</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/procedures/${procedure.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-rose-900 mb-2">{procedure.name}</h2>
              <div className="flex items-center space-x-4 mb-4">
                {procedure.category && (
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                    {procedure.category}
                  </Badge>
                )}
                <Badge className={procedure.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {procedure.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            {procedure.description && (
              <div>
                <h4 className="font-medium text-sm text-rose-700 mb-2">Descripción</h4>
                <p className="text-gray-600">{procedure.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procedure.duration_minutes && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span className="text-sm">
                    <strong>Duración:</strong> {procedure.duration_minutes} minutos
                  </span>
                </div>
              )}
              {procedure.price && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-rose-600" />
                  <span className="text-sm">
                    <strong>Precio:</strong> ${procedure.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requisitos */}
        {procedure.requirements && (
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Requisitos
              </CardTitle>
              <CardDescription>Condiciones necesarias antes del tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{procedure.requirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Contraindicaciones */}
        {procedure.contraindications && (
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Contraindicaciones
              </CardTitle>
              <CardDescription>Situaciones en las que no se debe realizar el tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                <p className="text-purple-800">{procedure.contraindications}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cuidados Post-Tratamiento */}
        {procedure.aftercare_instructions && (
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Cuidados Post-Tratamiento
              </CardTitle>
              <CardDescription>Instrucciones para el cliente después del procedimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-blue-800">{procedure.aftercare_instructions}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {/* Acciones Rápidas */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <Link href="/appointments/new">Programar Cita</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/procedures/${procedure.id}/edit`}>Editar Procedimiento</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium text-rose-700">Creado:</span>
              <br />
              {new Date(procedure.created_at).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm">
              <span className="font-medium text-rose-700">Estado:</span>
              <br />
              <Badge className={procedure.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {procedure.active ? "Disponible para citas" : "No disponible"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
