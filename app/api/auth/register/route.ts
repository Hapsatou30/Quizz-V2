import { type NextRequest, NextResponse } from "next/server"
import { addUser, usernameExists } from "@/lib/users"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Le nom d'utilisateur et le mot de passe sont requis" }, { status: 400 })
    }

    // Vérifier si le nom d'utilisateur existe déjà
    if (usernameExists(username)) {
      return NextResponse.json({ error: "Ce nom d'utilisateur est déjà utilisé" }, { status: 409 })
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      scores: [],
    }

    const user = addUser(newUser)

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    // console.error("Erreur d'inscription:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 })
  }
}
