"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  first_name: string
  last_name: string
}

interface Procedure {
  id: string
  name: string
  category: string | null
  description: string | null
}

interface TreatmentFormProps {
  client: Client
}

export function TreatmentForm({ client }: TreatmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [formData, setFormData] = useState({
    procedure_id: "",
    treatment_date: new Date().toISOString().split("T")[0],
    pre_treatment_notes: "",
    treatment_details: "",
    post_treatment_notes: "",
    products_used: "",
    next_appointment_recommendation: "",
  })

  useEffect(() => {
    fetchProcedures()
  }, [])

  const fetchProcedures = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("procedures").select("*").eq("active", true).order("name")

    if (error) {
      console.error("Error fetching procedures:", error)
    } else {
      setProcedures(data || [])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      const { error } = await supabase.from("treatment_records").insert({
        ...formData,
        client_id: client.id,
        user_id: user.id,
        treatment_date: new Date(formData.treatment_date).toISOString(),
      })

      if (error) throw error

      router.push(`/clients/${client.id}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-rose-600 hover:text-rose-700">
          <Link href={`/clients/${client.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Perfil
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Tratamiento */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Información del Tratamiento</CardTitle>
            <CardDescription>Detalles básicos del tratamiento realizado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="procedure_id">Procedimiento *</Label>
                <Select
                  value={formData.procedure_id}
                  onValueChange={(value) => handleInputChange("procedure_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar procedimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedures.map((procedure) => (
                      <SelectItem key={procedure.id} value={procedure.id}>
                        {procedure.name}
                        {procedure.category && ` (${procedure.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment_date">Fecha del Tratamiento *</Label>
                <Input
                  id="treatment_date"
                  type="date"
                  required
                  value={formData.treatment_date}
                  onChange={(e) => handleInputChange("treatment_date", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas del Tratamiento */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Notas del Tratamiento</CardTitle>
            <CardDescription>Registro detallado del procedimiento realizado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pre_treatment_notes">Notas Pre-Tratamiento</Label>
              <Textarea
                id="pre_treatment_notes"
                placeholder="Estado de la piel, preparación, observaciones iniciales..."
                value={formData.pre_treatment_notes}
                onChange={(e) => handleInputChange("pre_treatment_notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment_details">Detalles del Tratamiento *</Label>
              <Textarea
                id="treatment_details"
                placeholder="Descripción detallada del procedimiento realizado..."
                required
                value={formData.treatment_details}
                onChange={(e) => handleInputChange("treatment_details", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="products_used">Productos Utilizados</Label>
              <Textarea
                id="products_used"
                placeholder="Lista de productos, marcas, concentraciones utilizadas..."
                value={formData.products_used}
                onChange={(e) => handleInputChange("products_used", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_treatment_notes">Notas Post-Tratamiento</Label>
              <Textarea
                id="post_treatment_notes"
                placeholder="Reacción de la piel, cuidados inmediatos, observaciones finales..."
                value={formData.post_treatment_notes}
                onChange={(e) => handleInputChange("post_treatment_notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_appointment_recommendation">Recomendación Próxima Cita</Label>
              <Textarea
                id="next_appointment_recommendation"
                placeholder="Cuándo programar la próxima sesión, tratamientos recomendados..."
                value={formData.next_appointment_recommendation}
                onChange={(e) => handleInputChange("next_appointment_recommendation", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-purple-600 text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/clients/${client.id}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
            {loading ? "Guardando..." : "Guardar Tratamiento"}
          </Button>
        </div>
      </form>
    </div>
  )
}
