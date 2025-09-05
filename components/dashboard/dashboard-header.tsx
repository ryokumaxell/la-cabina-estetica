"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User, Calendar, Users, FileText, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/auth/login")
    }
  }

  return (
    <header className="bg-white border-b border-purple-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-purple-900">
              Estética Pro
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-purple-700 hover:text-purple-900 font-medium">
                Dashboard
              </Link>
              <Link href="/clients" className="text-purple-700 hover:text-purple-900 font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Clientes
              </Link>
              <Link
                href="/appointments"
                className="text-purple-700 hover:text-purple-900 font-medium flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Citas
              </Link>
              <Link href="/procedures" className="text-purple-700 hover:text-purple-900 font-medium flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Procedimientos
              </Link>
              <Link href="/reports" className="text-purple-700 hover:text-purple-900 font-medium flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Reportes
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-100 text-purple-700">EP</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
