"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Search } from "lucide-react"
import { TechnicalRecordGenerator } from "./technical-record-generator"

interface Client {
  id: string
  first_name: string
  last_name: string
}

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

export function ReportsOverview() {
  const [clients, setClients] = useState<Client[]>([])
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([])
  const [filteredTreatments, setFilteredTreatments] = useState<TreatmentRecord[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentRecord | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    fetchClients()
    fetchTreatments()
  }, [])

  useEffect(() => {
    filterTreatments()
  }, [treatments, selectedClient, dateFrom, dateTo, searchTerm])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const fetchTreatments = async () => {
    try {
      const response = await fetch("/api/treatments")
      if (response.ok) {
        const data = await response.json()
        setTreatments(data)
      }
    } catch (error) {
      console.error("Error fetching treatments:", error)
    }
  }

  const filterTreatments = () => {
    let filtered = treatments

    if (selectedClient) {
      filtered = filtered.filter((t) =>
        `${t.clients.first_name} ${t.clients.last_name}`.toLowerCase().includes(selectedClient.toLowerCase()),
      )
    }

    if (dateFrom) {
      filtered = filtered.filter((t) => new Date(t.treatment_date) >= new Date(dateFrom))
    }

    if (dateTo) {
      filtered = filtered.filter((t) => new Date(t.treatment_date) <= new Date(dateTo))
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.treatment_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.procedures?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTreatments(filtered)
  }

  const handleGenerateReport = (treatment: TreatmentRecord) => {
    setSelectedTreatment(treatment)
    setShowGenerator(true)
  }

  if (showGenerator && selectedTreatment) {
    return (
      <TechnicalRecordGenerator
        treatment={selectedTreatment}
        onBack={() => {
          setShowGenerator(false)
          setSelectedTreatment(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Buscar tratamientos para generar registros técnicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-search">Cliente</Label>
              <Input
                id="client-search"
                placeholder="Buscar por nombre..."
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-from">Fecha Desde</Label>
              <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Fecha Hasta</Label>
              <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-term">Buscar en Tratamientos</Label>
              <Input
                id="search-term"
                placeholder="Procedimiento, detalles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tratamientos */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Tratamientos Disponibles
          </CardTitle>
          <CardDescription>{filteredTreatments.length} tratamiento(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTreatments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-rose-600">No se encontraron tratamientos con los filtros aplicados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTreatments.map((treatment) => (
                <div key={treatment.id} className="border border-rose-100 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-rose-600" />
                        <span className="font-medium text-rose-900">
                          {treatment.clients.first_name} {treatment.clients.last_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-rose-600" />
                        <span className="text-sm text-gray-600">
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
                      <p className="text-sm text-gray-600 line-clamp-2">{treatment.treatment_details}</p>
                    </div>
                    <Button onClick={() => handleGenerateReport(treatment)} className="bg-rose-600 hover:bg-rose-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Registro
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
