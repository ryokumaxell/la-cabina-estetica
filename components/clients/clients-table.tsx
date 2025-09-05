"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Eye, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
  skin_type: string | null
  created_at: string
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching clients:", error)
    } else {
      setClients(data || [])
    }
    setLoading(false)
  }

  const filteredClients = clients.filter(
    (client) =>
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm),
  )

  if (loading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando clientes...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-900">Lista de Clientes</CardTitle>
        <CardDescription>Gestiona la información de todos tus clientes</CardDescription>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-rose-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-rose-600 mb-4">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados aún"}
            </p>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/clients/new">Agregar Primer Cliente</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Tipo de Piel</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.first_name} {client.last_name}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.email && (
                          <div className="flex items-center text-sm text-rose-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center text-sm text-rose-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.skin_type ? (
                        <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                          {client.skin_type}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No especificado</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(client.created_at).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/clients/${client.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/clients/${client.id}/edit`}>
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
