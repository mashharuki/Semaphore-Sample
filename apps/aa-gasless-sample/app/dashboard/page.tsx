"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useBiconomy } from "hooks/useBiconomy"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { Header } from "../../components/layout/header"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { LoadingSpinner } from "../../components/ui/loading"
import { generateProof, hashPassword } from "./../../lib/zk-utils"

// 動的レンダリングを強制してプリレンダリングエラーを回避
export const dynamic = "force-dynamic"

/**
 * ダッシュボード（NFTミント画面）コンポーネント
 */
export default function DashboardPage() {
  const router = useRouter()
  const { ready, authenticated } = usePrivy()

  // 未認証の場合はログイン画面にリダイレクト
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
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

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!authenticated) {
    return null
  }

  // 認証済みの場合にのみダッシュボードコンテンツを表示
  return <AuthenticatedDashboard />
}

/**
 * 認証済みユーザー向けのダッシュボードコンテンツ
 */
function AuthenticatedDashboard() {
  const { initializeBiconomyAccount, mintNFT } = useBiconomy()

  // NFTミント用のstate
  const [password, setPassword] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [mintedTokens, setMintedTokens] = useState<
    Array<{
      tokenId: string
      tokenURI: string
      transactionHash: string
    }>
  >([])

  /**
   * NFTをミントするハンドラーメソッド
   * @returns
   */
  const handleMintNFT = async () => {
    if (!password.trim()) {
      toast.error("パスワードを入力してください")
      return
    }

    setIsMinting(true)

    try {
      toast.loading("ZK Proofを生成中...", { id: "minting" })

      // パスワードからinputデータを生成
      const result = await hashPassword(password)
      const passwordNumber = result.data?.passwordNumber
      // ZK Proofを生成
      // @ts-expect-error this is a workaround for the type error
      const proofResult = await generateProof(passwordNumber)

      if (!proofResult.success || !proofResult.data) {
        throw new Error(proofResult.error || "failed to generate proof")
      }

      toast.loading("NFTをミント中...", { id: "minting" })

      // Biconomyを初期化してSmart Walletを作成する
      const { nexusClient, address: smartWalletAddress } = await initializeBiconomyAccount()

      if (!smartWalletAddress) {
        throw new Error("Smart wallet initialization failed")
      }

      console.log("Smart wallet Address:", smartWalletAddress)

      // NFTをミントする
      const hash = await mintNFT(nexusClient, proofResult.data.proof, proofResult.data.publicSignals)

      console.log("Minted NFT transaction hash:", hash)

      setPassword("")
      toast.success("NFTのミントが完了しました！", { id: "minting" })
    } catch (error) {
      console.error("Mint error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`エラーが発生しました: ${errorMessage}`, { id: "minting" })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* ユーザー情報セクション */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Welcome back!</CardTitle>
            </CardHeader>
          </Card>

          {/* NFTミントセクション */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">🎨 Mint ZKNFT</CardTitle>
              <CardDescription className="text-gray-300">
                Create a new NFT protected by zero-knowledge proof
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* パスワード入力 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Secret Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  disabled={isMinting}
                />
                <p className="text-xs text-gray-400">This password will be used to generate a zero-knowledge proof</p>
              </div>

              {/* ミントボタン */}
              <Button
                onClick={handleMintNFT}
                disabled={isMinting || !password.trim()}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg neon-glow transition-all duration-300"
                size="lg"
              >
                {isMinting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Minting NFT...
                  </>
                ) : (
                  "Mint ZKNFT"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ミント済みNFT一覧 */}
          {mintedTokens.length > 0 && (
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white">🏆 Your Minted NFTs</CardTitle>
                <CardDescription className="text-gray-300">
                  {mintedTokens.length} NFT{mintedTokens.length > 1 ? "s" : ""} minted
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mintedTokens.map((token) => (
                    <Card key={token.tokenId} className="glass-effect border-green-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-300">
                            <span className="text-green-400">Token ID:</span> #{token.tokenId}
                          </div>
                          <div className="text-xs text-gray-400 break-all">
                            <span className="text-purple-400">Tx:</span> {token.transactionHash}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
