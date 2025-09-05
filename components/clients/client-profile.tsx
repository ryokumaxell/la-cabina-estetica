import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle, Pill, Edit } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_conditions: string | null
  allergies: string | null
  medications: string | null
  skin_type: string | null
  notes: string | null
  created_at: string
}

interface ClientProfileProps {
  client: Client
}

export function ClientProfile({ client }: ClientProfileProps) {
  const age = client.date_of_birth ? new Date().getFullYear() - new Date(client.date_of_birth).getFullYear() : null

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <Card className="border-rose-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-rose-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Información Personal
            </CardTitle>
            <CardDescription>Datos básicos del cliente</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/clients/${client.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-rose-600" />
              <span className="font-medium">
                {client.first_name} {client.last_name}
              </span>
            </div>

            {client.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rose-600" />
                <span className="text-sm">{client.email}</span>
              </div>
            )}

            {client.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rose-600" />
                <span className="text-sm">{client.phone}</span>
              </div>
            )}

            {client.date_of_birth && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-rose-600" />
                <span className="text-sm">
                  {new Date(client.date_of_birth).toLocaleDateString("es-ES")}
                  {age && ` (${age} años)`}
                </span>
              </div>
            )}

            {client.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span className="text-sm">{client.address}</span>
              </div>
            )}

            {client.skin_type && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Tipo de piel:</span>
                <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                  {client.skin_type}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacto de Emergencia */}
      {(client.emergency_contact_name || client.emergency_contact_phone) && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Contacto de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.emergency_contact_name && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-rose-600" />
                <span className="text-sm">{client.emergency_contact_name}</span>
              </div>
            )}
            {client.emergency_contact_phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rose-600" />
                <span className="text-sm">{client.emergency_contact_phone}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información Médica */}
      {(client.medical_conditions || client.allergies || client.medications) && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Información Médica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.medical_conditions && (
              <div>
                <h4 className="font-medium text-sm text-rose-700 mb-1">Condiciones Médicas</h4>
                <p className="text-sm text-gray-600">{client.medical_conditions}</p>
              </div>
            )}
            {client.allergies && (
              <div>
                <h4 className="font-medium text-sm text-rose-700 mb-1">Alergias</h4>
                <p className="text-sm text-gray-600">{client.allergies}</p>
              </div>
            )}
            {client.medications && (
              <div>
                <h4 className="font-medium text-sm text-rose-700 mb-1 flex items-center">
                  <Pill className="h-4 w-4 mr-1" />
                  Medicamentos
                </h4>
                <p className="text-sm text-gray-600">{client.medications}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      {client.notes && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{client.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
