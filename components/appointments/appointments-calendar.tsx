"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  appointment_date: string
  duration_minutes: number
  status: string
  notes: string | null
  clients: {
    first_name: string
    last_name: string
  }
  procedures: {
    name: string
    category: string | null
  } | null
}

export function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchAppointments()
  }, [currentDate])

  const fetchAppointments = async () => {
    const supabase = createClient()

    // Get start and end of current month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        clients (first_name, last_name),
        procedures (name, category)
      `,
      )
      .gte("appointment_date", startOfMonth.toISOString())
      .lte("appointment_date", endOfMonth.toISOString())
      .order("appointment_date", { ascending: true })

    if (error) {
      console.error("Error fetching appointments:", error)
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getAppointmentsForDay = (day: number) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointment_date)
      return (
        aptDate.getDate() === day &&
        aptDate.getMonth() === currentDate.getMonth() &&
        aptDate.getFullYear() === currentDate.getFullYear()
      )
    })
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
        return "bg-purple-100 text-purple-700"
      case "no_show":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-rose-100 text-rose-700"
    }
  }

  if (loading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando calendario...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-rose-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Calendario de Citas
            </CardTitle>
            <CardDescription>
              {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-rose-700 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth().map((day, index) => (
            <div key={index} className="min-h-[100px] border border-rose-100 rounded-lg p-2">
              {day && (
                <>
                  <div className="font-medium text-sm text-rose-900 mb-2">{day}</div>
                  <div className="space-y-1">
                    {getAppointmentsForDay(day).map((appointment) => (
                      <Link key={appointment.id} href={`/appointments/${appointment.id}`}>
                        <div
                          className={`text-xs p-1 rounded ${getStatusColor(appointment.status)} hover:bg-rose-200 cursor-pointer`}
                        >
                          <div className="font-medium truncate">
                            {appointment.clients.first_name} {appointment.clients.last_name}
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(appointment.appointment_date).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-rose-600 mb-4">No hay citas programadas este mes</p>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/appointments/new">
                <Plus className="h-4 w-4 mr-2" />
                Programar Primera Cita
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
