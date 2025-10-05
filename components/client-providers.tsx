"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { Web3Provider } from "@/components/providers/web3-provider"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  )
}
