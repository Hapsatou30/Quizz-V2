"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

type User = {
  id: string
  username: string
  scores: any[]
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Charger l'utilisateur depuis le sessionStorage au démarrage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        // console.error("Erreur lors du chargement de l'utilisateur:", error)
        sessionStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Erreur de connexion",
          description: data.error || "Nom d'utilisateur ou mot de passe incorrect",
          variant: "destructive",
        })
        return false
      }

      // Stocker l'utilisateur dans le sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(data.user))
      setUser(data.user)

      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${data.user.username} !`,
      })

      return true
    } catch (error) {
      // console.error("Erreur de connexion:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Erreur d'inscription",
          description: data.error || "Une erreur est survenue lors de l'inscription",
          variant: "destructive",
        })
        return false
      }

      // Stocker l'utilisateur dans le sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(data.user))
      setUser(data.user)

      toast({
        title: "Inscription réussie",
        description: `Bienvenue, ${data.user.username} !`,
      })

      return true
    } catch (error) {
      // console.error("Erreur d'inscription:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem("currentUser")
    setUser(null)
    router.push("/auth")
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    })
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
