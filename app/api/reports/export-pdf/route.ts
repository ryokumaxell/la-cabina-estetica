import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth"

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { treatmentId, record } = await request.json()

    // In a real implementation, you would use a PDF generation library like puppeteer or jsPDF
    // For now, we'll create a simple text-based PDF response

    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${record.length + 100}
>>
stream
BT
/F1 12 Tf
50 750 Td
(${record.replace(/\n/g, ") Tj T* (")}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000${(400 + record.length).toString().padStart(3, "0")} 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${450 + record.length}
%%EOF`

    const buffer = Buffer.from(pdfContent, "utf-8")

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="registro-tecnico.pdf"',
      },
    })
  } catch (error) {
    console.error("Error exporting PDF:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
