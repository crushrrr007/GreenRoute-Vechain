"use client"

import type React from "react"
import { useEffect } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/web3/config"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress console errors from WalletConnect analytics
    const originalError = console.error
    console.error = (...args: any[]) => {
      // Filter out WalletConnect analytics errors
      const errorMessage = args[0]?.toString() || ""
      if (
        errorMessage.includes("Analytics SDK") ||
        errorMessage.includes("AnalyticsSDKApiError") ||
        errorMessage.includes("pulse.walletconnect.org")
      ) {
        // Silently ignore analytics errors
        return
      }
      // Pass through all other errors
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
