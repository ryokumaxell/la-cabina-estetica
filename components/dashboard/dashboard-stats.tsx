"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react"

interface DashboardStats {
  totalClients: number
  todayAppointments: number
  monthlyRevenue: number
  growthPercentage: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    growthPercentage: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? "+" : ""
    return `${sign}${percentage.toFixed(1)}%`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-rose-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Total Clientes</CardTitle>
          <Users className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">{loading ? "..." : stats.totalClients}</div>
          <p className="text-xs text-rose-600">Clientes registrados</p>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Citas Hoy</CardTitle>
          <Calendar className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">{loading ? "..." : stats.todayAppointments}</div>
          <p className="text-xs text-rose-600">Programadas para hoy</p>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Ingresos Mes</CardTitle>
          <DollarSign className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900">
            {loading ? "..." : formatCurrency(stats.monthlyRevenue)}
          </div>
          <p className="text-xs text-rose-600">Este mes</p>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700">Crecimiento</CardTitle>
          <TrendingUp className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.growthPercentage >= 0 ? "text-green-600" : "text-purple-600"}`}>
            {loading ? "..." : formatPercentage(stats.growthPercentage)}
          </div>
          <p className="text-xs text-rose-600">vs mes anterior</p>
        </CardContent>
      </Card>
    </div>
  )
}
