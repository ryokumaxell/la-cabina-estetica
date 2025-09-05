import { mockClients, type Client } from "./clients"
import { mockProcedures, type Procedure } from "./procedures"
import { mockAppointments, type Appointment } from "./appointments"
import { mockTreatments, type Treatment } from "./treatments"

// Simulate database operations with local storage
class MockDatabase {
  private getStorageKey(entity: string) {
    return `aesthetic_app_${entity}`
  }

  private getData<T>(entity: string, defaultData: T[]): T[] {
    if (typeof window === "undefined") return defaultData
    const stored = localStorage.getItem(this.getStorageKey(entity))
    return stored ? JSON.parse(stored) : defaultData
  }

  private setData<T>(entity: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.getStorageKey(entity), JSON.stringify(data))
  }

  // Clients
  getClients(): Client[] {
    return this.getData("clients", mockClients)
  }

  getClient(id: string): Client | null {
    const clients = this.getClients()
    return clients.find((c) => c.id === id) || null
  }

  createClient(client: Omit<Client, "id" | "created_at">): Client {
    const clients = this.getClients()
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    clients.push(newClient)
    this.setData("clients", clients)
    return newClient
  }

  updateClient(id: string, updates: Partial<Client>): Client | null {
    const clients = this.getClients()
    const index = clients.findIndex((c) => c.id === id)
    if (index === -1) return null

    clients[index] = { ...clients[index], ...updates }
    this.setData("clients", clients)
    return clients[index]
  }

  // Procedures
  getProcedures(): Procedure[] {
    return this.getData("procedures", mockProcedures)
  }

  getProcedure(id: string): Procedure | null {
    const procedures = this.getProcedures()
    return procedures.find((p) => p.id === id) || null
  }

  createProcedure(procedure: Omit<Procedure, "id" | "created_at">): Procedure {
    const procedures = this.getProcedures()
    const newProcedure: Procedure = {
      ...procedure,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    procedures.push(newProcedure)
    this.setData("procedures", procedures)
    return newProcedure
  }

  updateProcedure(id: string, updates: Partial<Procedure>): Procedure | null {
    const procedures = this.getProcedures()
    const index = procedures.findIndex((p) => p.id === id)
    if (index === -1) return null

    procedures[index] = { ...procedures[index], ...updates }
    this.setData("procedures", procedures)
    return procedures[index]
  }

  // Appointments
  getAppointments(): Appointment[] {
    const appointments = this.getData("appointments", mockAppointments)
    const clients = this.getClients()
    const procedures = this.getProcedures()

    return appointments.map((apt) => ({
      ...apt,
      clients: clients.find((c) => c.id === apt.client_id),
      procedures: procedures.find((p) => p.id === apt.procedure_id),
    }))
  }

  getUpcomingAppointments(limit = 5): Appointment[] {
    const appointments = this.getAppointments()
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.appointment_date)
        return aptDate >= now && aptDate <= nextWeek && ["scheduled", "confirmed"].includes(apt.status)
      })
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
      .slice(0, limit)
  }

  getAppointment(id: string): Appointment | null {
    const appointments = this.getAppointments()
    return appointments.find((a) => a.id === id) || null
  }

  createAppointment(appointment: Omit<Appointment, "id" | "created_at">): Appointment {
    const appointments = this.getData("appointments", mockAppointments)
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    appointments.push(newAppointment)
    this.setData("appointments", appointments)
    return newAppointment
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const appointments = this.getData("appointments", mockAppointments)
    const index = appointments.findIndex((a) => a.id === id)
    if (index === -1) return null

    appointments[index] = { ...appointments[index], ...updates }
    this.setData("appointments", appointments)
    return appointments[index]
  }

  // Treatments
  getTreatments(): Treatment[] {
    return this.getData("treatments", mockTreatments)
  }

  getTreatmentsByClient(clientId: string): Treatment[] {
    const treatments = this.getTreatments()
    return treatments
      .filter((t) => t.client_id === clientId)
      .sort((a, b) => new Date(b.treatment_date).getTime() - new Date(a.treatment_date).getTime())
  }

  createTreatment(treatment: Omit<Treatment, "id" | "created_at">): Treatment {
    const treatments = this.getTreatments()
    const newTreatment: Treatment = {
      ...treatment,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    treatments.push(newTreatment)
    this.setData("treatments", treatments)
    return newTreatment
  }

  // Statistics
  getStats() {
    const clients = this.getClients()
    const appointments = this.getAppointments()
    const treatments = this.getTreatments()

    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const monthlyAppointments = appointments.filter((apt) => new Date(apt.appointment_date) >= thisMonth)

    const monthlyTreatments = treatments.filter((treatment) => new Date(treatment.treatment_date) >= thisMonth)

    return {
      totalClients: clients.length,
      monthlyAppointments: monthlyAppointments.length,
      monthlyTreatments: monthlyTreatments.length,
      upcomingAppointments: this.getUpcomingAppointments().length,
    }
  }
}

export const mockDB = new MockDatabase()
export type { Client, Procedure, Appointment, Treatment }
