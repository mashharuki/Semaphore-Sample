"use client"

import { useState } from "react"
import { supabase } from "../utils/supabase"

/**
 * Authコンポーネント:
 * Web3ウォレット（Ethereum）によるログイン機能を提供します。
 */
export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("") // ユーザーへのメッセージ（エラー等）

  /**
   * Web3ウォレット（Ethereum）による認証
   */
  const handleWeb3Auth = async () => {
    setLoading(true)
    setMessage("")

    try {
      // @supabase/auth-js の signInWithWeb3 を使用
      // ブラウザに window.ethereum があれば自動的に利用されます
      const { error } = await (supabase.auth as any).signInWithWeb3({
        chain: "ethereum"
      })

      if (error) {
        setMessage(`Web3 Auth error: ${error.message}`)
      }
    } catch (err: any) {
      setMessage(`Unexpected error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h3>Login with Wallet</h3>
      <p style={{ fontSize: "14px", marginBottom: "20px" }}>
        Web3ウォレットを使用してログインし、Semaphoreアイデンティティを管理します。
      </p>

      <button
        className="button secondary"
        onClick={handleWeb3Auth}
        disabled={loading}
        style={{ width: "100%", backgroundColor: "#627EEA", color: "white" }}
      >
        {loading ? "Connecting..." : "Continue with Wallet (Ethereum)"}
      </button>

      {message && <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>{message}</p>}
    </div>
  )
}
