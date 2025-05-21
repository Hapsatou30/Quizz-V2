import { type NextRequest, NextResponse } from "next/server"
import { findUser } from "@/lib/users"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Le nom d'utilisateur et le mot de passe sont requis" }, { status: 400 })
    }

    const user = findUser(username, password)

    if (!user) {
      // Vérifier si l'utilisateur existe uniquement par le nom d'utilisateur
      const userExists = findUser(username, "");
      if (!userExists) {
        return NextResponse.json({ error: "Aucun compte trouvé avec ce nom d'utilisateur. Veuillez vous inscrire." }, { status: 404 })
      }

      return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 })
    }

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    // console.error("Erreur de connexion:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la connexion" }, { status: 500 })
  }
}