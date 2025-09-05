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
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
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
}

interface ProcedureEditFormProps {
  procedure: Procedure
}

export function ProcedureEditForm({ procedure }: ProcedureEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: procedure.name || "",
    description: procedure.description || "",
    duration_minutes: procedure.duration_minutes?.toString() || "",
    price: procedure.price?.toString() || "",
    category: procedure.category || "",
    requirements: procedure.requirements || "",
    contraindications: procedure.contraindications || "",
    aftercare_instructions: procedure.aftercare_instructions || "",
    active: procedure.active,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("procedures")
        .update({
          name: formData.name,
          description: formData.description || null,
          duration_minutes: formData.duration_minutes ? Number.parseInt(formData.duration_minutes) : null,
          price: formData.price ? Number.parseFloat(formData.price) : null,
          category: formData.category || null,
          requirements: formData.requirements || null,
          contraindications: formData.contraindications || null,
          aftercare_instructions: formData.aftercare_instructions || null,
          active: formData.active,
        })
        .eq("id", procedure.id)

      if (error) throw error

      router.push(`/procedures/${procedure.id}`)
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
          <Link href={`/procedures/${procedure.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Procedimiento
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Información Básica</CardTitle>
            <CardDescription>Detalles principales del procedimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Procedimiento *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facial">Facial</SelectItem>
                    <SelectItem value="Peeling">Peeling</SelectItem>
                    <SelectItem value="Hidratación">Hidratación</SelectItem>
                    <SelectItem value="Anti-edad">Anti-edad</SelectItem>
                    <SelectItem value="Acné">Acné</SelectItem>
                    <SelectItem value="Corporal">Corporal</SelectItem>
                    <SelectItem value="Depilación">Depilación</SelectItem>
                    <SelectItem value="Masajes">Masajes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duración (minutos)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
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
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
              />
              <Label htmlFor="active">Procedimiento activo</Label>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos y Contraindicaciones */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Requisitos y Contraindicaciones</CardTitle>
            <CardDescription>Información importante para la seguridad del tratamiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">Requisitos</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraindications">Contraindicaciones</Label>
              <Textarea
                id="contraindications"
                value={formData.contraindications}
                onChange={(e) => handleInputChange("contraindications", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cuidados Post-Tratamiento */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Cuidados Post-Tratamiento</CardTitle>
            <CardDescription>Instrucciones para el cliente después del procedimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="aftercare_instructions">Instrucciones de Cuidado</Label>
              <Textarea
                id="aftercare_instructions"
                value={formData.aftercare_instructions}
                onChange={(e) => handleInputChange("aftercare_instructions", e.target.value)}
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
            <Link href={`/procedures/${procedure.id}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
