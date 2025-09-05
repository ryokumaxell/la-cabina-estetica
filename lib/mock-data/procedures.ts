export interface Procedure {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  category: string
  contraindications: string
  aftercare_instructions: string
  is_active: boolean
  created_at: string
}

export const mockProcedures: Procedure[] = [
  {
    id: "1",
    name: "Limpieza Facial Profunda",
    description: "Limpieza completa con extracción de comedones y mascarilla purificante",
    duration_minutes: 60,
    price: 65,
    category: "Facial",
    contraindications: "Piel muy sensible, rosácea activa",
    aftercare_instructions: "Evitar maquillaje por 24h, usar protector solar",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Peeling Químico Suave",
    description: "Exfoliación química con ácidos suaves para renovar la piel",
    duration_minutes: 45,
    price: 85,
    category: "Facial",
    contraindications: "Embarazo, lactancia, piel muy sensible",
    aftercare_instructions: "No exposición solar directa por 7 días, usar crema hidratante",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Tratamiento Anti-Aging",
    description: "Combinación de radiofrecuencia y mesoterapia para rejuvenecimiento",
    duration_minutes: 90,
    price: 150,
    category: "Anti-Aging",
    contraindications: "Marcapasos, embarazo, infecciones activas",
    aftercare_instructions: "Hidratación abundante, evitar ejercicio intenso por 24h",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Hidratación Intensiva",
    description: "Tratamiento hidratante con ácido hialurónico y vitaminas",
    duration_minutes: 50,
    price: 75,
    category: "Hidratación",
    contraindications: "Alergia al ácido hialurónico",
    aftercare_instructions: "Mantener la piel hidratada, usar productos recomendados",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
]
