"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount, useBlockNumber, usePublicClient } from "wagmi"
import { ArrowUpRight, ArrowDownRight, Clock, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { formatEther } from "viem"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Transaction {
  hash: string
  type: "send" | "receive"
  amount: string
  timestamp: number
  status: "confirmed"
  from: string
  to: string
  blockNumber: bigint
}

export function WalletTransactions() {
  const { address, isConnected, chain } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const publicClient = usePublicClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    if (!isConnected || !address || !publicClient) return

    setIsLoading(true)
    setError(null)

    try {
      // Get the current block number
      const currentBlock = await publicClient.getBlockNumber()

      // Fetch the last 1000 blocks (adjust based on network)
      const fromBlock = currentBlock - BigInt(1000)

      // Fetch incoming transactions
      const incomingLogs = await publicClient
        .getLogs({
          address: undefined,
          event: undefined,
          fromBlock,
          toBlock: currentBlock,
        })
        .catch(() => [])

      // Fetch recent blocks to get transactions
      const recentTxs: Transaction[] = []

      // Get last 10 blocks and check for transactions involving this address
      for (let i = 0; i < 10; i++) {
        const blockNum = currentBlock - BigInt(i)
        try {
          const block = await publicClient.getBlock({ blockNumber: blockNum, includeTransactions: true })

          if (block.transactions) {
            for (const tx of block.transactions) {
              if (typeof tx === "object" && "from" in tx && "to" in tx) {
                const txFrom = tx.from?.toLowerCase()
                const txTo = tx.to?.toLowerCase()
                const userAddr = address.toLowerCase()

                if (txFrom === userAddr || txTo === userAddr) {
                  const type = txFrom === userAddr ? "send" : "receive"
                  const amount = tx.value ? formatEther(tx.value) : "0"

                  recentTxs.push({
                    hash: tx.hash,
                    type,
                    amount: `${Number.parseFloat(amount).toFixed(6)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
                    timestamp: Number(block.timestamp) * 1000,
                    status: "confirmed",
                    from: tx.from || "",
                    to: tx.to || "",
                    blockNumber: blockNum,
                  })
                }
              }
            }
          }
        } catch (err) {
          console.error(`Error fetching block ${blockNum}:`, err)
        }
      }

      // Sort by timestamp descending
      recentTxs.sort((a, b) => b.timestamp - a.timestamp)

      setTransactions(recentTxs.slice(0, 20)) // Keep last 20 transactions
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Failed to fetch transactions. This may be due to network limitations.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactions()
    }
  }, [isConnected, address, blockNumber])

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
    }
  }

  const openInExplorer = (hash: string) => {
    if (chain) {
      const explorerUrl = chain.blockExplorers?.default.url
      if (explorerUrl) {
        window.open(`${explorerUrl}/tx/${hash}`, "_blank")
      }
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="font-mono text-xl flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>View your wallet transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Connect your wallet to view transaction history</p>
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
              <Clock className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent wallet transactions on {chain?.name || "blockchain"}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactions}
            disabled={isLoading}
            className="bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-2">No transactions found</p>
            <p className="text-sm text-muted-foreground">
              Your wallet transactions will appear here once you start interacting with the blockchain
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-4 border-2 border-border hover:border-primary/30 rounded-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold capitalize">{tx.type}</p>
                      <span className="text-xs font-medium text-green-500">{tx.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`font-semibold font-mono ${tx.type === "send" ? "text-red-500" : "text-green-500"}`}>
                      {tx.type === "send" ? "-" : "+"}
                      {tx.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">Block {tx.blockNumber.toString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openInExplorer(tx.hash)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Transaction history is fetched from the blockchain. Click refresh to update with the latest transactions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
