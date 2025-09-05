"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, Clock, User, Calendar, Plus } from "lucide-react"
import Link from "next/link"

interface Appointment {
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
    phone: string | null
  }
  procedures: {
    name: string
    category: string | null
  } | null
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        clients (id, first_name, last_name, phone),
        procedures (name, category)
      `,
      )
      .order("appointment_date", { ascending: false })

    if (error) {
      console.error("Error fetching appointments:", error)
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      `${appointment.clients.first_name} ${appointment.clients.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.procedures?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clients.phone?.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  if (loading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando citas...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-900">Lista de Citas</CardTitle>
        <CardDescription>Gestiona todas las citas programadas</CardDescription>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-rose-400" />
            <Input
              placeholder="Buscar citas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="scheduled">Programada</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="no_show">No Asistió</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-rose-600 mb-4">
              {searchTerm || statusFilter !== "all" ? "No se encontraron citas" : "No hay citas programadas aún"}
            </p>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/appointments/new">
                <Plus className="h-4 w-4 mr-2" />
                Programar Primera Cita
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Procedimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {appointment.clients.first_name} {appointment.clients.last_name}
                        </div>
                        {appointment.clients.phone && (
                          <div className="text-sm text-rose-600 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {appointment.clients.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-rose-600" />
                          {new Date(appointment.appointment_date).toLocaleDateString("es-ES")}
                        </div>
                        <div className="flex items-center text-sm text-rose-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(appointment.appointment_date).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {appointment.procedures ? (
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{appointment.procedures.name}</div>
                          {appointment.procedures.category && (
                            <Badge variant="outline" className="border-rose-200 text-rose-600 text-xs">
                              {appointment.procedures.category}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin procedimiento</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>{getStatusLabel(appointment.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-rose-600" />
                        {appointment.duration_minutes} min
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/appointments/${appointment.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/appointments/${appointment.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
