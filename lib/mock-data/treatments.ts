export interface Treatment {
  id: string
  client_id: string
  procedure_id: string
  treatment_date: string
  pre_treatment_notes: string
  during_treatment_notes: string
  post_treatment_notes: string
  products_used: string
  recommendations: string
  next_appointment_recommendation: string
  created_at: string
}

export const mockTreatments: Treatment[] = [
  {
    id: "1",
    client_id: "1",
    procedure_id: "1",
    treatment_date: "2024-11-15T10:00:00Z",
    pre_treatment_notes: "Piel con comedones visibles, textura irregular",
    during_treatment_notes: "Extracción suave, buena tolerancia al tratamiento",
    post_treatment_notes: "Piel limpia, ligero enrojecimiento normal",
    products_used: "Limpiador enzimático, mascarilla de arcilla, sérum calmante",
    recommendations: "Usar protector solar diario, evitar productos comedogénicos",
    next_appointment_recommendation: "Repetir en 4-6 semanas",
    created_at: "2024-11-15T11:00:00Z",
  },
  {
    id: "2",
    client_id: "2",
    procedure_id: "2",
    treatment_date: "2024-11-20T14:30:00Z",
    pre_treatment_notes: "Piel sensible con rojeces leves",
    during_treatment_notes: "Peeling suave aplicado, sin reacciones adversas",
    post_treatment_notes: "Piel más uniforme, hidratación mejorada",
    products_used: "Peeling de ácido láctico 20%, neutralizador, crema calmante",
    recommendations: "Evitar exposición solar, usar crema hidratante específica",
    next_appointment_recommendation: "Control en 2 semanas",
    created_at: "2024-11-20T15:30:00Z",
  },
]
