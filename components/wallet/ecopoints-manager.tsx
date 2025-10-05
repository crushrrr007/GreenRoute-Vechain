"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowUpRight, ArrowDownRight, Coins } from "lucide-react"
import { useAccount } from "wagmi"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EcoPointsManagerProps {
  userId: string
  ecoPoints: number
}

export function EcoPointsManager({ userId, ecoPoints }: EcoPointsManagerProps) {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleMintTokens = async () => {
    if (!isConnected || !address) {
      setMessage({ type: "error", text: "Please connect your wallet first" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // TODO: Implement actual token minting logic
      // This will be implemented when we add the smart contract integration
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      setMessage({ type: "success", text: "Token minting will be available once smart contract is deployed" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to mint tokens. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!isConnected || !address) {
      setMessage({ type: "error", text: "Please connect your wallet first" })
      return
    }

    if (ecoPoints === 0) {
      setMessage({ type: "error", text: "No EcoPoints available to claim" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // TODO: Implement actual claiming logic
      // This will convert off-chain EcoPoints to on-chain tokens
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      setMessage({ type: "success", text: "Claiming rewards will be available once smart contract is deployed" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to claim rewards. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="font-mono text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          EcoPoints Management
        </CardTitle>
        <CardDescription>Manage your rewards and token balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Off-chain EcoPoints */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Off-Chain EcoPoints (Database)</p>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-4xl font-mono font-bold gradient-text">{ecoPoints}</p>
            <p className="text-lg text-muted-foreground">Points</p>
          </div>
          <p className="text-xs text-muted-foreground">Earned from completed trips and sustainable travel choices</p>
        </div>

        {/* On-chain Token Balance */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">On-Chain Token Balance</p>
          <div className="flex items-center gap-2 mb-4">
            <Coins className="h-6 w-6 text-primary" />
            <p className="text-3xl font-mono font-bold text-primary">0</p>
            <p className="text-lg text-muted-foreground">ECOPTS</p>
          </div>
          <p className="text-xs text-muted-foreground">Blockchain-verified EcoPoints tokens</p>
        </div>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleClaimRewards}
            disabled={!isConnected || isLoading || ecoPoints === 0}
            className="w-full"
          >
            <ArrowDownRight className="h-4 w-4 mr-2" />
            {isLoading ? "Processing..." : `Claim ${ecoPoints} EcoPoints as Tokens`}
          </Button>

          <Button
            onClick={handleMintTokens}
            disabled={!isConnected || isLoading}
            variant="outline"
            className="w-full bg-transparent"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            {isLoading ? "Processing..." : "Mint Test Tokens (Dev)"}
          </Button>
        </div>

        {!isConnected && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to manage EcoPoints tokens</p>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Smart contract integration is in development. Token claiming and minting features
            will be available once the EcoPoints token contract is deployed.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
