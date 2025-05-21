import { type NextRequest, NextResponse } from "next/server"
import { updateUserScores, getUsers } from "@/lib/users"

export async function PUT(request: NextRequest) {
  try {
    const { userId, scores } = await request.json()

    if (!userId || !scores) {
      return NextResponse.json({ error: "L'ID utilisateur et les scores sont requis" }, { status: 400 })
    }

    const updatedUser = updateUserScores(userId, scores)

    if (!updatedUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    // console.error("Erreur de mise à jour des scores:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la mise à jour des scores" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const users = getUsers()

    // Supprimer les mots de passe avant de renvoyer les utilisateurs
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)

    return NextResponse.json({ users: usersWithoutPasswords })
  } catch (error) {
    // console.error("Erreur de récupération des utilisateurs:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des utilisateurs" },
      { status: 500 },
    )
  }
}
