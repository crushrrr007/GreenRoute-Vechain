import { http, createConfig } from "wagmi"
import { mainnet, sepolia, polygon, base } from "wagmi/chains"
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors"

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

if (!projectId) {
  console.warn("[v0] WalletConnect project ID not found. Some wallet features may not work.")
}

// Configure supported chains
export const chains = [mainnet, sepolia, polygon, base] as const

// Configure wallet connectors
export const connectors = [
  injected({
    target: "metaMask",
  }),
  walletConnect({
    projectId,
    metadata: {
      name: "GreenRoute",
      description: "Sustainable Travel Platform",
      url: typeof window !== "undefined" ? window.location.origin : "https://greenroute.app",
      icons: ["https://greenroute.app/icon.png"],
    },
    showQrModal: false,
    qrModalOptions: {
      enableAnalytics: false,
    },
  }),
  coinbaseWallet({
    appName: "GreenRoute",
    appLogoUrl: "https://greenroute.app/icon.png",
  }),
]

// Create wagmi config
export const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
})

// Export chain IDs for easy reference
export const CHAIN_IDS = {
  MAINNET: mainnet.id,
  SEPOLIA: sepolia.id,
  POLYGON: polygon.id,
  BASE: base.id,
} as const

// Helper to get chain name
export function getChainName(chainId: number): string {
  const chain = chains.find((c) => c.id === chainId)
  return chain?.name || "Unknown Network"
}

// Helper to check if chain is supported
export function isSupportedChain(chainId: number): boolean {
  return chains.some((c) => c.id === chainId)
}
