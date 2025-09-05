"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar } from "lucide-react"
import Link from "next/link"

interface RecentClient {
  id: string
  first_name: string
  last_name: string
  email: string | null
  created_at: string
}

export function RecentClients() {
  const [clients, setClients] = useState<RecentClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentClients()
  }, [])

  const fetchRecentClients = async () => {
    try {
      const response = await fetch("/api/dashboard/recent-clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error fetching recent clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Clientes Recientes
        </CardTitle>
        <CardDescription>Últimos clientes registrados</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-rose-600">Cargando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-rose-600 mb-4">No hay clientes registrados aún</p>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/clients/new">Agregar Primer Cliente</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-rose-50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-rose-100 text-rose-700">
                      {getInitials(client.first_name, client.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-rose-900 truncate">
                      {client.first_name} {client.last_name}
                    </p>
                    {client.email && <p className="text-sm text-rose-600 truncate">{client.email}</p>}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(client.created_at).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/clients">Ver Todos los Clientes</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
