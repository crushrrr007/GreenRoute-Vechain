"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Copy, CheckCircle2, ExternalLink, Power } from "lucide-react"
import { useAccount, useBalance, useDisconnect } from "wagmi"
import { useState, useEffect } from "react"
import { syncWalletAddress, disconnectWallet } from "@/app/actions/wallet"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (isConnected && address) {
      handleSyncWallet()
    }
  }, [isConnected, address])

  const handleSyncWallet = async () => {
    if (!address) return

    setSyncing(true)
    setMessage(null)

    try {
      const result = await syncWalletAddress(address)
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: "Wallet synced successfully!" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to sync wallet" })
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      disconnect()
      setMessage({ type: "success", text: "Wallet disconnected successfully" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to disconnect wallet" })
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openInExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default.url
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, "_blank")
      }
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="font-mono text-xl flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Information
          </CardTitle>
          <CardDescription>Connect your wallet to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">No wallet connected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="font-mono text-xl flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Information
        </CardTitle>
        <CardDescription>Your connected Web3 wallet details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div>
          <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-sm break-all border-2 border-border">
              {address}
            </code>
            <Button variant="outline" size="icon" onClick={copyAddress} className="shrink-0 bg-transparent">
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={openInExplorer} className="shrink-0 bg-transparent">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="font-semibold">{chain?.name || "Unknown"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Balance</p>
            <p className="font-semibold font-mono">
              {balance ? `${Number.parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "0.0000"}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Chain ID: {chain?.id}</p>
          <div className="flex gap-2">
            <Button onClick={handleSyncWallet} disabled={syncing} variant="outline" className="flex-1 bg-transparent">
              {syncing ? "Syncing..." : "Sync Wallet"}
            </Button>
            <Button onClick={handleDisconnect} variant="destructive" className="flex-1">
              <Power className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Your wallet address is automatically synced with your GreenRoute profile. This enables blockchain-based
            rewards and token management.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
