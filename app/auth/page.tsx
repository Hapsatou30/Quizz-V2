"use client"

import { AuthForm } from "@/components/auth/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Récupérer les paramètres de redirection
  const redirect = searchParams.get("redirect")
  const category = searchParams.get("category")
  const level = searchParams.get("level")

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser && redirect) {
      // Construire l'URL de redirection
      let redirectUrl = `/${redirect}`
      if (category) redirectUrl += `?category=${category}`
      if (level) redirectUrl += `${category ? "&" : "?"}level=${level}`

      router.push(redirectUrl)
    }
  }, [redirect, category, level, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 dark:from-green-300 dark:to-green-500">
            Quiz Islamique
          </h1>
          <p className="text-green-700 dark:text-green-400 mt-2">
            Connectez-vous pour participer aux quiz et au classement
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}
