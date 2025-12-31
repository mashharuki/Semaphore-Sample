import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { PrivyProviders } from "./../providers/privy-providers"
import { ToasterProvider } from "./../providers/toaster-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZK NFT App",
  description: "Zero-Knowledge NFT Application with Privy Authentication"
}

/**
 * RootLayout コンポーネント
 * @param param0
 * @returns
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <PrivyProviders>
          <ToasterProvider>{children}</ToasterProvider>
        </PrivyProviders>
      </body>
    </html>
  )
}
