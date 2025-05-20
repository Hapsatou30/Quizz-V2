"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Vérifier le thème au chargement
  useEffect(() => {
    // Vérifier si le document existe (côté client)
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
  }, [])

  // Fonction pour basculer le thème manuellement
  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      // Basculer la classe sur l'élément HTML
      document.documentElement.classList.toggle("dark")
      // Mettre à jour l'état local
      setIsDark(!isDark)
      // Sauvegarder la préférence dans localStorage
      localStorage.setItem("theme", isDark ? "light" : "dark")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-md border border-green-200 dark:border-green-800 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      aria-label={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
    >
      {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
    </button>
  )
}
