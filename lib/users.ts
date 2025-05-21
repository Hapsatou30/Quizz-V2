import fs from "fs"
import path from "path"

// Chemin vers le fichier JSON des utilisateurs
const usersFilePath = path.join(process.cwd(), "data", "users.json")

// Type pour les utilisateurs
export type User = {
  id: string
  username: string
  password: string
  scores: any[]
}

// Fonction pour lire tous les utilisateurs
export const getUsers = (): User[] => {
  try {
    // Vérifier si le fichier existe, sinon créer un tableau vide
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2), "utf8")
      return []
    }

    const data = fs.readFileSync(usersFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erreur lors de la lecture des utilisateurs:", error)
    return []
  }
}

// Fonction pour sauvegarder les utilisateurs
export const saveUsers = (users: User[]): void => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8")
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des utilisateurs:", error)
  }
}

// Fonction pour trouver un utilisateur par nom d'utilisateur et mot de passe
export const findUser = (username: string, password: string): User | null => {
  const users = getUsers()
  return users.find((user) => user.username === username && user.password === password) || null
}

// Fonction pour vérifier si un nom d'utilisateur existe déjà
export const usernameExists = (username: string): boolean => {
  const users = getUsers()
  return users.some((user) => user.username === username)
}

// Fonction pour ajouter un nouvel utilisateur
export const addUser = (user: User): User => {
  const users = getUsers()
  users.push(user)
  saveUsers(users)
  return user
}

// Fonction pour mettre à jour les scores d'un utilisateur
export const updateUserScores = (userId: string, scores: any[]): User | null => {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) return null

  users[userIndex].scores = scores
  saveUsers(users)
  return users[userIndex]
}
