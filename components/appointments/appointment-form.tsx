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
  duration_minutes: number | null
  price: number | null
}

export function AppointmentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [formData, setFormData] = useState({
    client_id: "",
    procedure_id: "",
    appointment_date: "",
    appointment_time: "",
    duration_minutes: "",
    notes: "",
    price: "",
  })

  useEffect(() => {
    fetchClients()
    fetchProcedures()
  }, [])

  const fetchClients = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("clients").select("id, first_name, last_name").order("first_name")

    if (error) {
      console.error("Error fetching clients:", error)
    } else {
      setClients(data || [])
    }
  }

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

  const handleProcedureChange = (procedureId: string) => {
    const procedure = procedures.find((p) => p.id === procedureId)
    setFormData((prev) => ({
      ...prev,
      procedure_id: procedureId,
      duration_minutes: procedure?.duration_minutes?.toString() || "",
      price: procedure?.price?.toString() || "",
    }))
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

      // Combine date and time
      const appointmentDateTime = new Date(`${formData.appointment_date}T${formData.appointment_time}`)

      const { error } = await supabase.from("appointments").insert({
        client_id: formData.client_id,
        procedure_id: formData.procedure_id || null,
        appointment_date: appointmentDateTime.toISOString(),
        duration_minutes: Number.parseInt(formData.duration_minutes) || 60,
        notes: formData.notes || null,
        price: formData.price ? Number.parseFloat(formData.price) : null,
        user_id: user.id,
        status: "scheduled",
      })

      if (error) throw error

      router.push("/appointments")
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
          <Link href="/appointments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Citas
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Información de la Cita</CardTitle>
            <CardDescription>Detalles básicos de la cita a programar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <Select value={formData.client_id} onValueChange={(value) => handleInputChange("client_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure_id">Procedimiento</Label>
                <Select value={formData.procedure_id} onValueChange={handleProcedureChange}>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_date">Fecha *</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => handleInputChange("appointment_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment_time">Hora *</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  required
                  value={formData.appointment_time}
                  onChange={(e) => handleInputChange("appointment_time", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duración (minutos)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  placeholder="60"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange("duration_minutes", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Notas Adicionales</CardTitle>
            <CardDescription>Información adicional sobre la cita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones especiales, preparación requerida, etc."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-purple-600 text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/appointments">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
            {loading ? "Programando..." : "Programar Cita"}
          </Button>
        </div>
      </form>
    </div>
  )
}
