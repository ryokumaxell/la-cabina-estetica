import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="w-full max-w-sm">
        <Card className="border-rose-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-rose-900">¡Cuenta Creada!</CardTitle>
            <CardDescription>
              Hemos enviado un enlace de confirmación a tu email. Por favor, revisa tu bandeja de entrada y haz clic en
              el enlace para activar tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <Link href="/auth/login">Volver al Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
