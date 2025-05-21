"use client"

import Link from "next/link"
import { BookOpen, Award, Users, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import { Leaderboard } from "@/components/leaderboard"
import { categories } from "@/data/categories"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Vérifier si l'utilisateur est connecté en utilisant le hook useAuth
  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-xl font-bold text-green-700 dark:text-green-400">
            Quiz Islamique
          </Link>
          <div className="flex items-center space-x-3">
            <UserAvatar />
            <ThemeToggle />
          </div>
        </div>

        <header className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5 overflow-hidden">
            <div className="w-96 h-96 rounded-full bg-gradient-to-r from-green-300 to-green-500 dark:from-black dark:to-gray-800 blur-3xl"></div>
          </div>
          <div className="relative z-10 mb-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 dark:from-green-300 dark:to-green-500 mb-4 animate-fade-in">
              Quiz Islamique
            </h1>
            <p className="text-xl md:text-2xl text-black-700 dark:text-white-400 max-w-2xl mx-auto leading-relaxed">
              Testez vos connaissances et rapprochez-vous de la vérité
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <div className="text-center px-6 animate-float">
                  <div className="text-white text-2xl mb-2">"</div>
                  <h2 className="text-white text-2xl md:text-4xl font-bold text-center leading-snug">
                    رَبِّ زِدْنِي عِلْمًا
                    <br />
                    <span className="italic text-lg block mt-2">« Mon Seigneur, augmente-moi en science »</span>
                    <span className="italic text-base block mt-1">(Sourate Ta-Ha, 20:114)</span>
                  </h2>
                  <div className="text-white text-2xl mt-2">"</div>
                </div>
              </div>
              <img src="/savoir.jpg" alt="Mosquée" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 dark:from-green-300 dark:to-green-500 mb-8 text-center">
          Catégories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <div key={category.id} className="group h-full">
              <Card className="border-green-100 dark:border-green-900 shadow-md hover:shadow-xl transition-all duration-300 h-full overflow-hidden transform group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="relative h-72">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex items-end">
                    <h3 className="text-white text-xl font-bold p-4 group-hover:text-green-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <CardContent className="pt-4 pb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{category.description}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href={
                        mounted && isLoggedIn
                          ? `/quiz?category=${category.id}&level=debutant`
                          : `/auth?redirect=quiz&category=${category.id}&level=debutant`
                      }
                    >
                      <div className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50 text-green-800 dark:text-green-300 text-center py-2 rounded-md text-sm transition-colors duration-200 flex items-center justify-center">
                        <span>Débutant</span>
                        {mounted && !isLoggedIn && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                      </div>
                    </Link>
                    <Link
                      href={
                        mounted && isLoggedIn
                          ? `/quiz?category=${category.id}&level=intermediaire`
                          : `/auth?redirect=quiz&category=${category.id}&level=intermediaire`
                      }
                    >
                      <div className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50 text-green-800 dark:text-green-300 text-center py-2 rounded-md text-sm transition-colors duration-200 flex items-center justify-center">
                        <span>Intermédiaire</span>
                        {mounted && !isLoggedIn && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                      </div>
                    </Link>
                    <Link
                      href={
                        mounted && isLoggedIn
                          ? `/quiz?category=${category.id}&level=avance`
                          : `/auth?redirect=quiz&category=${category.id}&level=avance`
                      }
                    >
                      <div className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50 text-green-800 dark:text-green-300 text-center py-2 rounded-md text-sm transition-colors duration-200 flex items-center justify-center">
                        <span>Avancé</span>
                        {mounted && !isLoggedIn && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          {mounted && !isLoggedIn && (
            <Link href="/auth">
              <Button className="bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-lg px-8 py-6 h-auto">
                Connectez-vous pour jouer
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-400">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 mr-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                Apprentissage
              </CardTitle>
              <CardDescription>Approfondissez vos connaissances</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">
                Découvrez des questions variées sur le Coran, la Sunna, l'histoire islamique et bien plus encore.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-400">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 mr-3">
                  <Award className="h-5 w-5" />
                </div>
                Progression
              </CardTitle>
              <CardDescription>Suivez votre évolution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">
                Visualisez vos scores et votre progression au fil du temps pour améliorer vos connaissances.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-400">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 mr-3">
                  <Users className="h-5 w-5" />
                </div>
                Communauté
              </CardTitle>
              <CardDescription>Partagez avec d'autres</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">
                Comparez vos résultats avec vos amis et la communauté pour stimuler votre apprentissage.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center text-green-700 dark:text-green-500 mt-16 pb-8">
          <div className="w-24 h-1 bg-gradient-to-r from-green-300 to-green-600 dark:from-green-700 dark:to-green-500 mx-auto mb-6 rounded-full"></div>
          <p>© {new Date().getFullYear()} Quiz Islamique - Tous droits réservés</p>
        </footer>
      </div>
    </div> 
  )
}
