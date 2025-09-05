"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, Mail, FileText, DollarSign, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AppointmentDetailsProps {
  appointment: {
    id: string
    appointment_date: string
    duration_minutes: number
    status: string
    notes: string | null
    price: number | null
    clients: {
      id: string
      first_name: string
      last_name: string
      email: string | null
      phone: string | null
    }
    procedures: {
      id: string
      name: string
      category: string | null
      description: string | null
      duration_minutes: number | null
      price: number | null
    } | null
  }
}

export function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(appointment.status)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", appointment.id)

      if (error) throw error

      setCurrentStatus(newStatus)
      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "no_show":
        return "bg-orange-100 text-orange-700"
      case "in_progress":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-rose-100 text-rose-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "scheduled":
        return "Programada"
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      case "no_show":
        return "No Asistió"
      case "in_progress":
        return "En Progreso"
      default:
        return status
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Información de la Cita */}
        <Card className="border-rose-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-rose-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Información de la Cita
              </CardTitle>
              <CardDescription>Detalles de la cita programada</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/appointments/${appointment.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-rose-600" />
                  <span className="font-medium">
                    {new Date(appointment.appointment_date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span>
                    {new Date(appointment.appointment_date).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span>{appointment.duration_minutes} minutos</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Estado:</span>
                  <Badge className={getStatusColor(currentStatus)}>{getStatusLabel(currentStatus)}</Badge>
                </div>
                {appointment.price && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-rose-600" />
                    <span>${appointment.price.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {appointment.notes && (
              <div>
                <h4 className="font-medium text-sm text-rose-700 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Notas
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{appointment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Procedimiento */}
        {appointment.procedures && (
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-900">Procedimiento</CardTitle>
              <CardDescription>Detalles del tratamiento a realizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">{appointment.procedures.name}</h3>
                {appointment.procedures.category && (
                  <Badge variant="outline" className="border-rose-200 text-rose-600">
                    {appointment.procedures.category}
                  </Badge>
                )}
              </div>

              {appointment.procedures.description && (
                <div>
                  <h4 className="font-medium text-sm text-rose-700 mb-1">Descripción</h4>
                  <p className="text-sm text-gray-600">{appointment.procedures.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointment.procedures.duration_minutes && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-rose-600" />
                    <span className="text-sm">Duración: {appointment.procedures.duration_minutes} min</span>
                  </div>
                )}
                {appointment.procedures.price && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-rose-600" />
                    <span className="text-sm">Precio: ${appointment.procedures.price.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {/* Información del Cliente */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">
                {appointment.clients.first_name} {appointment.clients.last_name}
              </h3>
            </div>

            <div className="space-y-3">
              {appointment.clients.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-rose-600" />
                  <span className="text-sm">{appointment.clients.email}</span>
                </div>
              )}
              {appointment.clients.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-rose-600" />
                  <span className="text-sm">{appointment.clients.phone}</span>
                </div>
              )}
            </div>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/clients/${appointment.clients.id}`}>Ver Perfil Completo</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Cambiar Estado */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Cambiar Estado</CardTitle>
            <CardDescription>Actualiza el estado de la cita</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Programada</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="no_show">No Asistió</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <Link href={`/clients/${appointment.clients.id}/treatments/new`}>Registrar Tratamiento</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/appointments/${appointment.id}/edit`}>Editar Cita</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
