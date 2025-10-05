"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount, useBalance } from "wagmi"
import { Coins, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function TokenBalances() {
  const { address, isConnected, chain } = useAccount()
  const { data: nativeBalance, refetch, isLoading } = useBalance({ address })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  if (!isConnected) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="font-mono text-xl flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balances
          </CardTitle>
          <CardDescription>View your token holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Connect your wallet to view token balances</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-mono text-xl flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Token Balances
            </CardTitle>
            <CardDescription>Your token holdings on {chain?.name || "blockchain"}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Native Token Balance */}
          <div className="flex items-center justify-between p-4 border-2 border-primary/30 rounded-xl bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{chain?.nativeCurrency?.name || "Native Token"}</p>
                <p className="text-sm text-muted-foreground font-mono">{chain?.nativeCurrency?.symbol || "ETH"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold gradient-text">
                {nativeBalance ? Number.parseFloat(nativeBalance.formatted).toFixed(6) : "0.000000"}
              </p>
              <p className="text-sm text-muted-foreground">{nativeBalance?.symbol || "ETH"}</p>
            </div>
          </div>

          {/* EcoPoints Token (Placeholder) */}
          <div className="flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-lg">EcoPoints Token</p>
                <p className="text-sm text-muted-foreground font-mono">ECOPTS</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-green-600">0.000000</p>
              <p className="text-sm text-muted-foreground">ECOPTS</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> EcoPoints token contract is in development. Once deployed, your earned EcoPoints can
            be claimed as ECOPTS tokens and will appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
