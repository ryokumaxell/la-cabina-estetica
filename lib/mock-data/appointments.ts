export interface Appointment {
  id: string
  client_id: string
  procedure_id: string
  appointment_date: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"
  notes: string
  created_at: string
  clients?: {
    first_name: string
    last_name: string
  }
  procedures?: {
    name: string
  }
}

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    client_id: "1",
    procedure_id: "1",
    appointment_date: "2024-12-10T10:00:00Z",
    status: "confirmed",
    notes: "Primera cita, cliente nerviosa",
    created_at: "2024-12-05T09:00:00Z",
    clients: { first_name: "María", last_name: "González" },
    procedures: { name: "Limpieza Facial Profunda" },
  },
  {
    id: "2",
    client_id: "2",
    procedure_id: "2",
    appointment_date: "2024-12-11T14:30:00Z",
    status: "scheduled",
    notes: "Recordar usar productos hipoalergénicos",
    created_at: "2024-12-06T11:15:00Z",
    clients: { first_name: "Ana", last_name: "Martín" },
    procedures: { name: "Peeling Químico Suave" },
  },
  {
    id: "3",
    client_id: "3",
    procedure_id: "3",
    appointment_date: "2024-12-12T16:00:00Z",
    status: "confirmed",
    notes: "Cliente VIP, máxima atención",
    created_at: "2024-12-07T08:30:00Z",
    clients: { first_name: "Carmen", last_name: "López" },
    procedures: { name: "Tratamiento Anti-Aging" },
  },
  {
    id: "4",
    client_id: "1",
    procedure_id: "4",
    appointment_date: "2024-12-13T11:00:00Z",
    status: "scheduled",
    notes: "Seguimiento del tratamiento anterior",
    created_at: "2024-12-08T10:00:00Z",
    clients: { first_name: "María", last_name: "González" },
    procedures: { name: "Hidratación Intensiva" },
  },
]
