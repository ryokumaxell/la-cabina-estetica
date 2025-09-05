"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Star, Clock } from "lucide-react"

interface AnalyticsData {
  popularProcedures: Array<{
    name: string
    count: number
    category: string | null
  }>
  monthlyTrends: Array<{
    month: string
    appointments: number
    revenue: number
  }>
  clientSatisfaction: {
    averageRating: number
    totalReviews: number
  }
  businessMetrics: {
    averageSessionDuration: number
    clientRetentionRate: number
    bookingConversionRate: number
  }
}

export function BusinessAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/dashboard/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando análisis de negocio...</div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-rose-900 mb-2">Análisis de Negocio</h2>
        <p className="text-rose-600">Métricas y tendencias de tu práctica estética</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Procedimientos Populares */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Procedimientos Populares
            </CardTitle>
            <CardDescription>Tratamientos más solicitados este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularProcedures.slice(0, 5).map((procedure, index) => (
                <div key={procedure.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-rose-900">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{procedure.name}</p>
                      {procedure.category && (
                        <Badge variant="outline" className="text-xs border-rose-200 text-rose-600">
                          {procedure.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-rose-700">{procedure.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Satisfacción */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Satisfacción del Cliente
            </CardTitle>
            <CardDescription>Calificaciones y feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-900">
                  {analytics.clientSatisfaction.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= analytics.clientSatisfaction.averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-rose-600">Basado en {analytics.clientSatisfaction.totalReviews} reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Rendimiento */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Métricas de Rendimiento
            </CardTitle>
            <CardDescription>Indicadores clave del negocio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span className="text-sm">Duración Promedio</span>
                </div>
                <span className="text-sm font-bold text-rose-900">
                  {analytics.businessMetrics.averageSessionDuration} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Retención de Clientes</span>
                <span className="text-sm font-bold text-green-600">
                  {analytics.businessMetrics.clientRetentionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversión de Reservas</span>
                <span className="text-sm font-bold text-blue-600">
                  {analytics.businessMetrics.bookingConversionRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencias Mensuales */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Tendencias Mensuales</CardTitle>
          <CardDescription>Evolución de citas e ingresos por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {analytics.monthlyTrends.slice(-4).map((trend) => (
              <div key={trend.month} className="text-center p-4 bg-rose-50 rounded-lg">
                <h4 className="font-medium text-rose-900 mb-2">{trend.month}</h4>
                <div className="space-y-1">
                  <p className="text-sm text-rose-600">
                    <span className="font-bold">{trend.appointments}</span> citas
                  </p>
                  <p className="text-sm text-rose-600">
                    <span className="font-bold">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      }).format(trend.revenue)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
