"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { LoadingSpinner } from "../components/ui/loading"

/**
 * ログイン画面コンポーネント
 */
export default function LoginPage() {
  const router = useRouter()
  const { ready, authenticated, login } = usePrivy()

  // 認証済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard")
    }
  }, [ready, authenticated, router])

  // Privyが初期化中の場合はローディング表示
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // 既に認証済みの場合は何も表示しない（リダイレクト中）
  if (authenticated) {
    return null
  }

  /**
   * ログインメソッド
   */
  const handleLogin = async () => {
    try {
      // ログイン
      await login()
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* メインのログインカード */}
        <Card className="glass-effect border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <div className="text-3xl font-bold text-white">ZK</div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome to ZK NFT App</CardTitle>
            <CardDescription className="text-gray-300">
              Connect your wallet or create an account to start minting ZK-powered NFTs
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ログインボタン */}
            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg neon-glow transition-all duration-300"
              size="lg"
            >
              Connect Wallet & Login
            </Button>

            {/* 機能説明 */}
            <div className="text-center space-y-3">
              <div className="text-sm text-gray-400">Supported login methods:</div>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>• Email</span>
                <span>• Wallet</span>
                <span>• Google</span>
                <span>• Twitter</span>
              </div>
            </div>

            {/* セキュリティ情報 */}
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
              <div className="text-sm text-blue-200">
                <div className="font-semibold mb-1">🔒 Secure & Private</div>
                <div className="text-xs">
                  Your credentials are secured by Privy&apos;s industry-leading authentication system
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Powered by Zero-Knowledge Technology</p>
        </div>
      </div>
    </div>
  )
}
