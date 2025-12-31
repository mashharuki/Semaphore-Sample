"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import type React from "react"

interface PrivyProvidersProps {
  children: React.ReactNode
}

/**
 * Privyプロバイダーのラッパーコンポーネント
 */
export const PrivyProviders: React.FC<PrivyProvidersProps> = ({ children }) => {
  // 環境変数からPrivy設定を取得
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "test-app-id"

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // ログイン方法の設定
        loginMethods: ["email", "wallet", "google"],
        // 外観の設定
        appearance: {
          theme: "dark",
          accentColor: "#3B82F6"
        },
        // エンベデッドウォレットの設定
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets"
          }
        }
      }}
    >
      {children}
    </PrivyProvider>
  )
}
