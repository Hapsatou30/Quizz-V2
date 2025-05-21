"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function UserAvatar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const handleLogin = () => {
    router.push("/auth")
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogin}
        className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
      >
        <User className="h-4 w-4 mr-2" />
        Connexion
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border-2 border-green-500 dark:border-green-700">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=16a34a&color=fff`}
              alt={user.username}
            />
            <AvatarFallback className="bg-green-700 text-white">{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.username}</p>
        </div>
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
