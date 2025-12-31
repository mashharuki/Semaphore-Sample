"use client"

import { usePrivy } from "@privy-io/react-auth"
import { LogOut } from "lucide-react"
import React from "react"
import { Button } from "./../ui/button"

/**
 * アプリケーションのヘッダーコンポーネント
 */
export const Header: React.FC = () => {
  const { logout, user, authenticated } = usePrivy()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (!authenticated || !user) {
    return null
  }

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴエリア */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">ZK NFT App</h1>
          </div>

          {/* ユーザー情報とログアウトボタン */}
          <div className="flex items-center space-x-4">
            {/* ユーザー情報 */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.email?.address || user.wallet?.address?.slice(0, 6) + "..." || "User"}
              </div>
            </div>

            {/* ログアウトボタン */}
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
