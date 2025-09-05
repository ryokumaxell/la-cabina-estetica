"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Eye, Edit, Clock, DollarSign, Plus } from "lucide-react"
import Link from "next/link"

interface Procedure {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  price: number | null
  category: string | null
  active: boolean
  created_at: string
}

export function ProceduresTable() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchProcedures()
  }, [])

  const fetchProcedures = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("procedures").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching procedures:", error)
    } else {
      setProcedures(data || [])
    }
    setLoading(false)
  }

  const toggleProcedureStatus = async (procedureId: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("procedures").update({ active: !currentStatus }).eq("id", procedureId)

    if (error) {
      console.error("Error updating procedure status:", error)
    } else {
      setProcedures((prev) =>
        prev.map((proc) => (proc.id === procedureId ? { ...proc, active: !currentStatus } : proc)),
      )
    }
  }

  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.category?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || procedure.category === categoryFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && procedure.active) ||
      (statusFilter === "inactive" && !procedure.active)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = Array.from(new Set(procedures.map((p) => p.category).filter(Boolean)))

  if (loading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="p-8">
          <div className="text-center">Cargando procedimientos...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-900">Catálogo de Procedimientos</CardTitle>
        <CardDescription>Gestiona todos los tratamientos y servicios disponibles</CardDescription>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-rose-400" />
            <Input
              placeholder="Buscar procedimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProcedures.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-rose-600 mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "No se encontraron procedimientos"
                : "No hay procedimientos registrados aún"}
            </p>
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/procedures/new">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Procedimiento
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{procedure.name}</div>
                        {procedure.description && (
                          <div className="text-sm text-gray-600 truncate max-w-xs">{procedure.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {procedure.category ? (
                        <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                          {procedure.category}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Sin categoría</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {procedure.duration_minutes ? (
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1 text-rose-600" />
                          {procedure.duration_minutes} min
                        </div>
                      ) : (
                        <span className="text-gray-400">No especificado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {procedure.price ? (
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-3 w-3 mr-1 text-rose-600" />${procedure.price.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-gray-400">No especificado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={procedure.active}
                          onCheckedChange={() => toggleProcedureStatus(procedure.id, procedure.active)}
                        />
                        <span className="text-sm">{procedure.active ? "Activo" : "Inactivo"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/procedures/${procedure.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/procedures/${procedure.id}/edit`}>
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
