import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/hooks/use-auth"
import * as Toast from "@radix-ui/react-toast"
import { ToastProvider, ToastViewport } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quiz Islamique",
  description: "Testez vos connaissances sur l'Islam avec notre quiz interactif",
  generator: "v0.dev",
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
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
        <ToastProvider>
          {children}
          <ToastViewport className="fixed bottom-4 right-4 z-50 w-[320px] max-w-full" />
        </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}