import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { treatmentId } = await request.json()

    // Mock generated technical record
    const generatedRecord = `REGISTRO TÉCNICO PROFESIONAL
========================================

INFORMACIÓN DEL CLIENTE
- Nombre: María González
- Fecha de nacimiento: [Fecha]
- Tipo de piel: Mixta
- Alergias conocidas: Ninguna conocida
- Contacto: maria.gonzalez@email.com | +34 666 123 456

INFORMACIÓN DEL TRATAMIENTO
- Fecha: 15 de enero de 2024
- Procedimiento: Limpieza Facial Profunda
- Categoría: Facial
- Profesional: ${user.name}

EVALUACIÓN PRE-TRATAMIENTO
========================================
Estado inicial de la piel: Piel mixta con tendencia grasa en zona T, presencia de comedones abiertos y cerrados. Se observa acumulación de sebo en poros dilatados, especialmente en nariz y mentón. Piel deshidratada en mejillas.

Contraindicaciones evaluadas: Ninguna presente. Cliente apto para el tratamiento.

DESARROLLO DEL TRATAMIENTO
========================================
Protocolo aplicado:
1. Desmaquillado y limpieza inicial con gel limpiador suave
2. Aplicación de vapor facial durante 10 minutos para apertura de poros
3. Extracción manual de comedones con técnica aséptica
4. Aplicación de tónico astringente para cerrar poros
5. Mascarilla de arcilla verde durante 15 minutos
6. Hidratación final con crema no comedogénica

Productos utilizados:
- Gel limpiador con ácido salicílico 2%
- Tónico astringente con hamamelis
- Mascarilla de arcilla verde purificante
- Crema hidratante no comedogénica con niacinamida

EVALUACIÓN POST-TRATAMIENTO
========================================
Resultado inmediato: Piel limpia y purificada, reducción visible de comedones. Ligero enrojecimiento fisiológico que desaparecerá en 2-3 horas. Poros visiblemente más cerrados y piel con aspecto más uniforme.

Reacciones adversas: Ninguna observada.

RECOMENDACIONES Y CUIDADOS
========================================
Cuidados inmediatos (24-48h):
- Evitar exposición solar directa
- No aplicar maquillaje durante las primeras 4 horas
- Usar protector solar SPF 30+ mínimo
- Hidratación suave con productos no comedogénicos

Rutina de mantenimiento:
- Limpieza facial diaria con productos suaves
- Exfoliación química 1-2 veces por semana
- Hidratación diaria adaptada al tipo de piel
- Protección solar diaria

PRÓXIMA CITA
========================================
Recomendación: Repetir tratamiento en 4 semanas para mantener resultados óptimos.
Fecha sugerida: 15 de febrero de 2024
Observaciones especiales: Evaluar evolución de la piel y ajustar protocolo según necesidades.

FIRMA PROFESIONAL
========================================
Profesional: ${user.name}
Colegiado: [Número de colegiado]
Fecha: ${new Date().toLocaleDateString("es-ES")}
Firma: _________________________

Este registro técnico ha sido elaborado conforme a los estándares profesionales de la estética y constituye un documento oficial del tratamiento realizado.`

    return NextResponse.json({ record: generatedRecord }, { status: 200 })
  } catch (error) {
    console.error("Error generating record:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
