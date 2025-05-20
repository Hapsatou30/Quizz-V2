"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Timer, AlertCircle, Trophy } from "lucide-react"
import { quizData } from "@/data/quiz-data"
import { categories } from "@/data/categories"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import Link from "next/link"
import confetti from "canvas-confetti"

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")
  const level = searchParams.get("level") as "debutant" | "intermediaire" | "avance" | null

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (mounted) {
      const currentUser = localStorage.getItem("currentUser")
      if (!currentUser) {
        // Rediriger vers la page d'authentification
        router.push("/auth?redirect=quiz")
      }
    }
  }, [mounted, router])

  // Filtrer les questions par catégorie et niveau
  const filteredQuestions = quizData.filter((q) => {
    if (categoryId && level) {
      return q.category === categoryId && q.level === level
    } else if (categoryId) {
      return q.category === categoryId
    } else if (level) {
      return q.level === level
    }
    return true
  })

  // Obtenir le nom de la catégorie et du niveau
  const categoryName = categoryId ? categories.find((c) => c.id === categoryId)?.name : "Toutes les catégories"

  const levelName = level
    ? level === "debutant"
      ? "Débutant"
      : level === "intermediaire"
        ? "Intermédiaire"
        : "Avancé"
    : "Tous les niveaux"

  useEffect(() => {
    setMounted(true)
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  useEffect(() => {
    if (currentQuestion >= filteredQuestions.length) {
      if (score / filteredQuestions.length >= 0.7) {
        setShowConfetti(true)
        const duration = 2 * 1000
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

      // Sauvegarder le score si l'utilisateur est connecté
      if (user) {
        try {
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const userIndex = users.findIndex((u: any) => u.id === user.id)

          if (userIndex !== -1) {
            const scorePercentage = Math.round((score / filteredQuestions.length) * 100)

            // Ajouter le nouveau score
            const newScore = {
              score: scorePercentage,
              category: categoryId || "all",
              level: level || "all",
              date: Date.now(),
            }

            if (!users[userIndex].scores) {
              users[userIndex].scores = []
            }

            users[userIndex].scores.push(newScore)
            localStorage.setItem("users", JSON.stringify(users))

            // Mettre à jour l'utilisateur actuel
            user.scores = users[userIndex].scores
            localStorage.setItem("currentUser", JSON.stringify(user))
          }
        } catch (error) {
          console.error("Erreur lors de la sauvegarde du score:", error)
        }
      }

      router.push(
        `/resultats?score=${score}&total=${filteredQuestions.length}&category=${categoryId || "all"}&level=${level || "all"}`,
      )
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!isAnswered) {
            handleNextQuestion()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setTimeLeft(30)
    setSelectedAnswer(null)
    setIsAnswered(false)

    return () => clearInterval(timer)
  }, [currentQuestion, filteredQuestions.length, score, user, categoryId, level])

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
  }

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) return

    // Éviter de confirmer plusieurs fois
    if (isAnswered) return

    // Forcer la mise à jour de l'état isAnswered immédiatement
    setIsAnswered(true)

    const correctAnswer = filteredQuestions[currentQuestion].correctAnswer

    // Normaliser les chaînes pour la comparaison
    const normalizedSelected = selectedAnswer.trim()
    const normalizedCorrect = correctAnswer.trim()

    // Vérifier si la réponse est correcte
    const isCorrect = normalizedSelected === normalizedCorrect

    console.log("Réponse sélectionnée:", selectedAnswer)
    console.log("Réponse correcte:", correctAnswer)
    console.log("Est correcte:", isCorrect)
    console.log("État isAnswered:", true)

    // Incrémenter le score si la réponse est correcte
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
      // Afficher un petit effet de confetti pour les bonnes réponses
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    // Forcer le rendu pour s'assurer que l'explication s'affiche
    setTimeout(() => {
      if (!isAnswered) {
        setIsAnswered(true)
      }
    }, 100)
  }

  const handleNextQuestion = () => {
    if (!selectedAnswer && !isAnswered) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = ""
      setAnswers(newAnswers)
    }
    setCurrentQuestion((prev) => prev + 1)
  }

  if (!mounted || filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4">
            {filteredQuestions.length === 0 ? "Aucune question disponible" : "Chargement..."}
          </h1>
          {filteredQuestions.length === 0 && (
            <p className="text-green-700 dark:text-green-500 mb-6">
              Aucune question n'est disponible pour cette catégorie et ce niveau.
            </p>
          )}
          <Button
            onClick={() => router.push("/")}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  if (currentQuestion >= filteredQuestions.length) {
    return <div className="flex justify-center items-center h-screen">Chargement des résultats...</div>
  }

  const question = filteredQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
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

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">
                Question {currentQuestion + 1}/{filteredQuestions.length}
              </h2>
              <div className="flex items-center text-sm text-green-700 dark:text-green-500">
                <span className="mr-2">{categoryName}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {levelName}
                </span>
              </div>
            </div>
            <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 px-3 py-1 rounded-full">
              <Timer className="h-4 w-4 mr-1" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <Progress value={progress} className="h-2 bg-green-100 dark:bg-green-900" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-100 dark:border-green-900 shadow-lg mb-8 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 text-white rounded-t-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs opacity-80">
                    {categoryName} • {levelName}
                  </div>
                  <div className="text-xs opacity-80">
                    Question {currentQuestion + 1}/{filteredQuestions.length}
                  </div>
                </div>
                <CardTitle className="text-xl">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup value={selectedAnswer || ""} className="space-y-4">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center space-x-2 p-3 rounded-lg cursor-pointer border-2 transition-all
                        ${selectedAnswer === option && !isAnswered ? "border-green-500 bg-green-50 dark:bg-green-900/30" : "border-gray-200 dark:border-gray-700"}
                        ${isAnswered && option === question.correctAnswer ? "border-green-500 bg-green-100 dark:bg-green-900/50" : ""}
                        ${isAnswered && selectedAnswer === option && option !== question.correctAnswer ? "border-red-500 bg-red-100 dark:bg-red-900/30" : ""}
                        ${!isAnswered ? "hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20" : ""}
                      `}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer dark:text-gray-200">
                        {option}
                      </Label>
                      {isAnswered && option === question.correctAnswer && (
                        <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                      )}
                      {isAnswered && selectedAnswer === option && option !== question.correctAnswer && (
                        <span className="ml-2 text-red-600 dark:text-red-400">✗</span>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Explication:</h4>
                    <p className="dark:text-gray-300">{question.explanation}</p>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                {/* Bouton pour confirmer la réponse */}
                {!isAnswered ? (
                  <Button
                    onClick={handleConfirmAnswer}
                    disabled={!selectedAnswer}
                    className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Confirmer ma réponse
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 animate-pulse"
                  >
                    {currentQuestion === filteredQuestions.length - 1 ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" /> Voir les résultats
                      </>
                    ) : (
                      <>
                        Question suivante <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="text-center text-green-700 dark:text-green-500 mt-8">
          <p className="flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Répondez à toutes les questions pour obtenir votre score final
          </p>
        </div>
      </div>
    </div>
  )
}
