import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/hooks/use-auth"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quiz Islamique",
  description: "Testez vos connaissances sur l'Islam avec notre quiz interactif",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            // Vérifier si un thème est stocké dans localStorage
            const savedTheme = localStorage.getItem('theme');
            // Vérifier si l'utilisateur préfère le thème sombre au niveau du système
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Appliquer le thème sombre si sauvegardé ou préféré par le système
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
      <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  )
}

