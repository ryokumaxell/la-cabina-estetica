"use client"

import type React from "react"

import { useState } from "react"
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
  email: string | null
  phone: string | null
  date_of_birth: string | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_conditions: string | null
  allergies: string | null
  medications: string | null
  skin_type: string | null
  notes: string | null
}

interface ClientEditFormProps {
  client: Client
}

export function ClientEditForm({ client }: ClientEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: client.first_name || "",
    last_name: client.last_name || "",
    email: client.email || "",
    phone: client.phone || "",
    date_of_birth: client.date_of_birth || "",
    address: client.address || "",
    emergency_contact_name: client.emergency_contact_name || "",
    emergency_contact_phone: client.emergency_contact_phone || "",
    medical_conditions: client.medical_conditions || "",
    allergies: client.allergies || "",
    medications: client.medications || "",
    skin_type: client.skin_type || "",
    notes: client.notes || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("clients").update(formData).eq("id", client.id)

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
        {/* Información Personal */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Información Personal</CardTitle>
            <CardDescription>Datos básicos del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  required
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido *</Label>
                <Input
                  id="last_name"
                  required
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Fecha de Nacimiento</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skin_type">Tipo de Piel</Label>
                <Select value={formData.skin_type} onValueChange={(value) => handleInputChange("skin_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de piel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grasa">Grasa</SelectItem>
                    <SelectItem value="seca">Seca</SelectItem>
                    <SelectItem value="mixta">Mixta</SelectItem>
                    <SelectItem value="sensible">Sensible</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacto de Emergencia */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Contacto de Emergencia</CardTitle>
            <CardDescription>Información de contacto en caso de emergencia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Nombre del Contacto</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Teléfono del Contacto</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Médica */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Información Médica</CardTitle>
            <CardDescription>Historial médico relevante para los tratamientos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Condiciones Médicas</Label>
              <Textarea
                id="medical_conditions"
                placeholder="Diabetes, hipertensión, problemas cardíacos, etc."
                value={formData.medical_conditions}
                onChange={(e) => handleInputChange("medical_conditions", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                placeholder="Alergias conocidas a medicamentos, productos, etc."
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Medicamentos Actuales</Label>
              <Textarea
                id="medications"
                placeholder="Medicamentos que toma actualmente"
                value={formData.medications}
                onChange={(e) => handleInputChange("medications", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas Adicionales */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Notas Adicionales</CardTitle>
            <CardDescription>Información adicional relevante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Preferencias, observaciones especiales, etc."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/clients/${client.id}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
