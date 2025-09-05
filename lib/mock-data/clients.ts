export interface Client {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_history: string
  allergies: string
  current_medications: string
  previous_treatments: string
  skin_type: string
  treatment_goals: string
  notes: string
  created_at: string
}

export const mockClients: Client[] = [
  {
    id: "1",
    first_name: "María",
    last_name: "González",
    email: "maria.gonzalez@email.com",
    phone: "+34 666 123 456",
    date_of_birth: "1985-03-15",
    address: "Calle Mayor 123, Madrid",
    emergency_contact_name: "Juan González",
    emergency_contact_phone: "+34 666 654 321",
    medical_history: "Sin antecedentes relevantes",
    allergies: "Ninguna conocida",
    current_medications: "Ninguna",
    previous_treatments: "Limpieza facial básica",
    skin_type: "Mixta",
    treatment_goals: "Mejorar textura de la piel",
    notes: "Cliente muy satisfecha con tratamientos anteriores",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    first_name: "Ana",
    last_name: "Martín",
    email: "ana.martin@email.com",
    phone: "+34 677 234 567",
    date_of_birth: "1990-07-22",
    address: "Avenida de la Paz 45, Barcelona",
    emergency_contact_name: "Carlos Martín",
    emergency_contact_phone: "+34 677 765 432",
    medical_history: "Piel sensible",
    allergies: "Alérgica al níquel",
    current_medications: "Crema hidratante recetada",
    previous_treatments: "Peeling químico suave",
    skin_type: "Sensible",
    treatment_goals: "Reducir rojeces",
    notes: "Requiere productos hipoalergénicos",
    created_at: "2024-02-01T14:30:00Z",
  },
  {
    id: "3",
    first_name: "Carmen",
    last_name: "López",
    email: "carmen.lopez@email.com",
    phone: "+34 688 345 678",
    date_of_birth: "1978-11-08",
    address: "Plaza del Sol 12, Valencia",
    emergency_contact_name: "Miguel López",
    emergency_contact_phone: "+34 688 876 543",
    medical_history: "Sin problemas de salud",
    allergies: "Ninguna",
    current_medications: "Vitaminas",
    previous_treatments: "Botox, rellenos",
    skin_type: "Madura",
    treatment_goals: "Anti-aging",
    notes: "Cliente VIP, muy exigente con los resultados",
    created_at: "2024-01-20T09:15:00Z",
  },
]
