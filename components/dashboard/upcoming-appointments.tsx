"use client"

import { useState, useEffect } from "react"
import { mockDB, type Appointment } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingAppointments()
  }, [])

  const fetchUpcomingAppointments = async () => {
    try {
      const data = mockDB.getUpcomingAppointments(5)
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-purple-100 text-purple-700"
    }
  }

  if (loading) {
    return (
      <Card className="border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando citas...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Próximas Citas
        </CardTitle>
        <CardDescription>Citas programadas para los próximos días</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-purple-600 mb-4">No hay citas programadas</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/appointments/new">Programar Cita</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Link key={appointment.id} href={`/appointments/${appointment.id}`}>
                <div className="p-4 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">
                        {appointment.clients?.first_name} {appointment.clients?.last_name}
                      </span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status === "confirmed" ? "Confirmada" : "Programada"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-purple-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-600">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(appointment.appointment_date).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {appointment.procedures && (
                      <div className="text-sm text-gray-600">{appointment.procedures.name}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/appointments">Ver Todas las Citas</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
