"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Home, RefreshCw, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import confetti from "canvas-confetti"
import Link from "next/link"
import { categories } from "@/data/categories"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

export default function ResultatsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)
  const { user } = useAuth()

  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "10")
  const categoryId = searchParams.get("category") || "all"
  const level = searchParams.get("level") || "all"
  const percentage = Math.round((score / total) * 100)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Effet pour sauvegarder le score
  useEffect(() => {
    const saveScore = async () => {
      if (user && !scoreSaved) {
        try {
          // Créer un nouvel objet score
          const newScore = {
            score: percentage,
            category: categoryId,
            level,
            date: Date.now(),
          }

          // Récupérer les scores actuels de l'utilisateur
          const currentScores = user.scores || []

          // Ajouter le nouveau score
          const updatedScores = [...currentScores, newScore]

          // Envoyer la mise à jour à l'API
          const response = await fetch(`/api/users/scores`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              scores: updatedScores,
            }),
          })

          if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde du score")
          }

          setScoreSaved(true)
          toast({
            title: "Score enregistré",
            description: "Votre score a été enregistré avec succès",
          })
        } catch (error) {
          // console.error("Erreur lors de la sauvegarde du score:", error)
          toast({
            title: "Erreur",
            description: "Impossible d'enregistrer votre score",
            variant: "destructive",
          })
        }
      }
    }

    if (user && mounted && !scoreSaved) {
      saveScore()
    }
  }, [user, mounted, scoreSaved, percentage, categoryId, level])

  useEffect(() => {
    if (percentage >= 70) {
      setShowConfetti(true)
      const duration = 3 * 1000
      const end = Date.now() + duration

      const runConfetti = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10B981", "#059669", "#047857"],
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#10B981", "#059669", "#047857"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti)
        }
      }

      runConfetti()
    }
  }, [percentage])

  const getMessage = () => {
    if (percentage >= 90) return "Excellent ! Vous êtes un véritable savant !"
    if (percentage >= 70) return "Très bien ! Vous avez de solides connaissances !"
    if (percentage >= 50) return "Bien ! Continuez à apprendre !"
    return "Continuez vos efforts, la connaissance s'acquiert avec le temps !"
  }

  const getEmoji = () => {
    if (percentage >= 90) return "🏆"
    if (percentage >= 70) return "🌟"
    if (percentage >= 50) return "👍"
    return "📚"
  }

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mon résultat au Quiz Islamique",
        text: `J'ai obtenu ${score}/${total} (${percentage}%) au Quiz Islamique ! Essayez de faire mieux !`,
        url: window.location.href,
      })
    } else {
      alert("Le partage n'est pas pris en charge par votre navigateur.")
    }
  }

  const shareOnWhatsApp = () => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : ""
    const text = encodeURIComponent(
      `J'ai obtenu ${score}/${total} (${percentage}%) au Quiz Islamique sur ${categoryName} niveau ${levelName} ! Essayez de faire mieux ! ${siteUrl}`,
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  // Obtenir le nom de la catégorie et du niveau
  const categoryName =
    categoryId !== "all" ? categories.find((c) => c.id === categoryId)?.name : "Toutes les catégories"

  const levelName =
    level !== "all"
      ? level === "debutant"
        ? "Débutant"
        : level === "intermediaire"
          ? "Intermédiaire"
          : "Avancé"
      : "Tous les niveaux"

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="inline-block mr-2 h-4 w-4" /> Retour à l'accueil
          </Link>
          <div className="flex items-center space-x-3">
            <UserAvatar />
            <ThemeToggle />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex justify-center items-center">
                <Award className="mr-2 h-6 w-6" /> Résultats du Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-6 text-center">
              <div className="text-6xl font-bold mb-4 text-green-800 dark:text-green-400">
                {getEmoji()} {percentage}%
              </div>

              <p className="text-xl mb-6 dark:text-gray-200">
                Vous avez obtenu{" "}
                <span className="font-bold text-green-700 dark:text-green-400">
                  {score}/{total}
                </span>{" "}
                bonnes réponses
              </p>

              <div className="mb-4 text-sm text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 mr-2">
                  {categoryName}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {levelName}
                </span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm dark:text-gray-300">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <Progress value={percentage} className="h-4 bg-green-100 dark:bg-green-900" />
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                <p className="text-green-800 dark:text-green-400 text-lg">{getMessage()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                  <p className="text-green-800 dark:text-green-400 font-semibold">Temps moyen</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">18s</p>
                  <p className="text-sm text-green-600 dark:text-green-500">par question</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                  <p className="text-green-800 dark:text-green-400 font-semibold">Niveau</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
                    {level === "debutant"
                      ? "Débutant"
                      : level === "intermediaire"
                        ? "Intermédiaire"
                        : level === "avance"
                          ? "Avancé"
                          : "Tous niveaux"}
                  </p>
                  {level === "debutant" || level === "intermediaire" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1 text-xs border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400"
                      onClick={() =>
                        router.push(
                          `/quiz?category=${categoryId}&level=${level === "debutant" ? "intermediaire" : "avance"}`,
                        )
                      }
                    >
                      Passer au niveau {level === "debutant" ? "intermédiaire" : "avancé"} →
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400"
                  onClick={() => router.push("/")}
                >
                  <Home className="mr-2 h-4 w-4" /> Accueil
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 text-green-600 dark:text-green-400"
                  onClick={shareOnWhatsApp}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.586 16.874c-.28.41-.769.792-1.239 1.015-.57.271-1.317.447-2.358.447-.958 0-1.92-.136-2.863-.404-2.104-.595-3.873-1.568-5.264-2.959-1.39-1.391-2.362-3.16-2.958-5.264-.269-.943-.405-1.905-.405-2.863 0-1.041.176-1.788.447-2.358.223-.47.605-.959 1.015-1.239.447-.307 1.064-.362 1.494-.362.149 0 .298 0 .447.014.447.025.842.308 1.079.744l.744 1.793c.149.347.223.744.074 1.116-.074.198-.173.372-.297.52-.124.149-.272.323-.396.471-.074.099-.124.198-.05.347.248.496.595.942.991 1.34.397.397.843.744 1.34.991.149.074.248.025.347-.05.149-.123.322-.272.471-.396.149-.124.322-.223.52-.297.372-.149.769-.074 1.116.074l1.793.744c.436.236.719.632.744 1.079.025.447.025 1.04-.282 1.487z" />
                  </svg>
                  WhatsApp
                </Button>
              </div>
              <Button
                className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
                onClick={() => router.push(`/quiz?category=${categoryId}&level=${level}`)}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Refaire le quiz
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
