"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar, User, Wand2 } from "lucide-react"

interface TreatmentRecord {
  id: string
  treatment_date: string
  treatment_details: string
  clients: {
    first_name: string
    last_name: string
  }
  procedures: {
    name: string
    category: string | null
  } | null
}

interface TechnicalRecordGeneratorProps {
  treatment: TreatmentRecord
  onBack: () => void
}

export function TechnicalRecordGenerator({ treatment, onBack }: TechnicalRecordGeneratorProps) {
  const [fullTreatment, setFullTreatment] = useState<any>(null)
  const [generatedRecord, setGeneratedRecord] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchFullTreatmentData()
  }, [treatment.id])

  const fetchFullTreatmentData = async () => {
    try {
      const response = await fetch(`/api/treatments/${treatment.id}`)
      if (response.ok) {
        const data = await response.json()
        setFullTreatment(data)
      }
    } catch (error) {
      console.error("Error fetching full treatment data:", error)
    }
  }

  const generateTechnicalRecord = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentId: treatment.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedRecord(data.record)
      }
    } catch (error) {
      console.error("Error generating record:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/reports/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          treatmentId: treatment.id,
          record: generatedRecord,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `registro-tecnico-${treatment.clients.first_name}-${treatment.clients.last_name}-${new Date(treatment.treatment_date).toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!fullTreatment) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando datos del tratamiento...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-rose-600 hover:text-rose-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Reportes
        </Button>
        <div className="flex space-x-2">
          <Button onClick={generateTechnicalRecord} disabled={isGenerating} className="bg-rose-600 hover:bg-rose-700">
            <Wand2 className="h-4 w-4 mr-2" />
            {isGenerating ? "Generando..." : "Generar Registro"}
          </Button>
          {generatedRecord && (
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exportando..." : "Exportar PDF"}
            </Button>
          )}
        </div>
      </div>

      {/* Información del Tratamiento */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Información del Tratamiento
          </CardTitle>
          <CardDescription>Datos base para generar el registro técnico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-rose-600" />
                <span className="font-medium text-rose-900">
                  {fullTreatment.clients.first_name} {fullTreatment.clients.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-rose-600" />
                <span className="text-sm text-gray-600">
                  {new Date(fullTreatment.treatment_date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {fullTreatment.procedures && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                    {fullTreatment.procedures.name}
                  </Badge>
                  {fullTreatment.procedures.category && (
                    <Badge variant="outline" className="border-rose-200 text-rose-600">
                      {fullTreatment.procedures.category}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-rose-700">Detalles del Tratamiento</h4>
              <p className="text-sm text-gray-600">{fullTreatment.treatment_details}</p>
              {fullTreatment.products_used && (
                <>
                  <h4 className="font-medium text-sm text-rose-700 mt-3">Productos Utilizados</h4>
                  <p className="text-sm text-gray-600">{fullTreatment.products_used}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registro Técnico Generado */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Registro Técnico Profesional</CardTitle>
          <CardDescription>
            Registro técnico generado automáticamente basado en los datos del tratamiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!generatedRecord ? (
            <div className="text-center py-8">
              <p className="text-rose-600 mb-4">
                Haz clic en "Generar Registro" para crear un registro técnico profesional
              </p>
              <p className="text-sm text-gray-500">
                El registro incluirá información detallada del cliente, procedimiento realizado, productos utilizados y
                recomendaciones profesionales.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={generatedRecord}
                onChange={(e) => setGeneratedRecord(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                placeholder="El registro técnico aparecerá aquí..."
              />
              <p className="text-xs text-gray-500">Puedes editar el registro generado antes de exportarlo a PDF</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
