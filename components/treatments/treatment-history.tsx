"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Camera, Clock, Plus } from "lucide-react"
import Link from "next/link"

interface TreatmentRecord {
  id: string
  treatment_date: string
  pre_treatment_notes: string | null
  treatment_details: string | null
  post_treatment_notes: string | null
  products_used: string | null
  next_appointment_recommendation: string | null
  created_at: string
  procedures: {
    name: string
    category: string | null
  } | null
  treatment_photos: {
    id: string
    photo_type: string
    description: string | null
  }[]
}

interface TreatmentHistoryProps {
  clientId: string
}

export function TreatmentHistory({ clientId }: TreatmentHistoryProps) {
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTreatments()
  }, [clientId])

  const fetchTreatments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("treatment_records")
      .select(
        `
        *,
        procedures (name, category),
        treatment_photos (id, photo_type, description)
      `,
      )
      .eq("client_id", clientId)
      .order("treatment_date", { ascending: false })

    if (error) {
      console.error("Error fetching treatments:", error)
    } else {
      setTreatments(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando historial de tratamientos...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-900 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Historial de Tratamientos
        </CardTitle>
        <CardDescription>Registro completo de todos los tratamientos realizados</CardDescription>
      </CardHeader>
      <CardContent>
        {treatments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-rose-600 mb-4">No hay tratamientos registrados aún</p>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href={`/clients/${clientId}/treatments/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primer Tratamiento
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {treatments.map((treatment) => (
              <div key={treatment.id} className="border border-rose-100 rounded-lg p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-rose-600" />
                      <span className="font-medium text-rose-900">
                        {new Date(treatment.treatment_date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {treatment.procedures && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                          {treatment.procedures.name}
                        </Badge>
                        {treatment.procedures.category && (
                          <Badge variant="outline" className="border-rose-200 text-rose-600">
                            {treatment.procedures.category}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {treatment.treatment_photos.length > 0 && (
                      <Badge variant="outline" className="border-rose-200 text-rose-600">
                        <Camera className="h-3 w-3 mr-1" />
                        {treatment.treatment_photos.length} fotos
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-rose-200 text-rose-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(treatment.created_at).toLocaleDateString("es-ES")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {treatment.pre_treatment_notes && (
                    <div>
                      <h4 className="font-medium text-sm text-rose-700 mb-1">Notas Pre-Tratamiento</h4>
                      <p className="text-sm text-gray-600">{treatment.pre_treatment_notes}</p>
                    </div>
                  )}

                  {treatment.treatment_details && (
                    <div>
                      <h4 className="font-medium text-sm text-rose-700 mb-1">Detalles del Tratamiento</h4>
                      <p className="text-sm text-gray-600">{treatment.treatment_details}</p>
                    </div>
                  )}

                  {treatment.products_used && (
                    <div>
                      <h4 className="font-medium text-sm text-rose-700 mb-1">Productos Utilizados</h4>
                      <p className="text-sm text-gray-600">{treatment.products_used}</p>
                    </div>
                  )}

                  {treatment.post_treatment_notes && (
                    <div>
                      <h4 className="font-medium text-sm text-rose-700 mb-1">Notas Post-Tratamiento</h4>
                      <p className="text-sm text-gray-600">{treatment.post_treatment_notes}</p>
                    </div>
                  )}

                  {treatment.next_appointment_recommendation && (
                    <div>
                      <h4 className="font-medium text-sm text-rose-700 mb-1">Recomendación Próxima Cita</h4>
                      <p className="text-sm text-gray-600">{treatment.next_appointment_recommendation}</p>
                    </div>
                  )}

                  {treatment.treatment_photos.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-rose-700 mb-2">Fotografías del Tratamiento</h4>
                      <div className="flex flex-wrap gap-2">
                        {treatment.treatment_photos.map((photo) => (
                          <Badge key={photo.id} variant="outline" className="border-rose-200 text-rose-600">
                            <Camera className="h-3 w-3 mr-1" />
                            {photo.photo_type}
                            {photo.description && ` - ${photo.description}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
