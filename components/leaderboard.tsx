"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

interface UserScore {
  userId: string
  userName: string
  score: number
  category?: string
  level?: string
  date: number
}

export function Leaderboard() {
  const [topScores, setTopScores] = useState<UserScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopScores()
  }, [])

  const loadTopScores = async () => {
    try {
      setLoading(true)

      // Récupérer les utilisateurs depuis l'API
      const response = await fetch("/api/users/scores")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des scores")
      }

      const data = await response.json()
      const users = data.users || []

      // Extraire tous les scores
      const allScores: UserScore[] = []
      users.forEach((user: any) => {
        if (user.scores && Array.isArray(user.scores)) {
          user.scores.forEach((score: any) => {
            allScores.push({
              userId: user.id,
              userName: user.username || user.name, // Utiliser username ou name pour la compatibilité
              score: score.score,
              category: score.category,
              level: score.level,
              date: score.date,
            })
          })
        }
      })

      // Trier par score décroissant et en cas d'égalité, par date décroissante (le plus récent d'abord)
      const top3 = allScores
        .sort((a, b) => {
          // D'abord comparer les scores
          if (b.score !== a.score) {
            return b.score - a.score
          }
          // En cas d'égalité, comparer les dates (le plus récent d'abord)
          return b.date - a.date
        })
        .slice(0, 3)

      setTopScores(top3)
    } catch (error) {
      // console.error("Erreur lors du chargement des scores:", error)
      setTopScores([])
    } finally {
      setLoading(false)
    }
  }

  // Si pas assez de scores, ajouter des exemples
  const displayScores = [...topScores]
  if (displayScores.length < 3) {
    const exampleScores = [
      { userId: "ex1", userName: "Ahmed", score: 95, category: "Coran", level: "Avancé", date: Date.now() },
      {
        userId: "ex2",
        userName: "Fatima",
        score: 90,
        category: "Histoire",
        level: "Intermédiaire",
        date: Date.now() - 1000,
      },
      { userId: "ex3", userName: "Omar", score: 85, category: "Pratiques", level: "Débutant", date: Date.now() - 2000 },
    ]

    // Ajouter uniquement les exemples nécessaires
    for (let i = displayScores.length; i < 3; i++) {
      displayScores.push(exampleScores[i])
    }
  }

  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500"
      case 1:
        return "text-gray-400"
      case 2:
        return "text-amber-700"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 text-white pb-2">
        <CardTitle className="flex items-center justify-center text-xl">
          <Trophy className="mr-2 h-5 w-5" />
          Top 3 des Joueurs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Chargement des scores...</div>
        ) : (
          <div className="divide-y divide-green-100 dark:divide-green-900">
            {displayScores.map((score, index) => (
              <div
                key={index}
                className={`flex items-center p-4 ${index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-green-500 dark:border-green-700">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(score.userName)}&background=16a34a&color=fff`}
                        alt={score.userName}
                      />
                      <AvatarFallback className="bg-green-700 text-white">{score.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 ${getTrophyColor(index)}`}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{score.userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {score.category} • {score.level}
                  </p>
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {score.score}%
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
