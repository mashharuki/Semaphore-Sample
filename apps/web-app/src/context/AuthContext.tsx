"use client"

import { Session, User } from "@supabase/supabase-js"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { supabase } from "../utils/supabase"

/**
 * AuthContextType: 認証コンテキストの型定義。
 */
interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

// 認証状態を共有するためのコンテキスト
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider:
 * Supabaseの認証状態（ユーザー、セッション）を管理し、子コンポーネントに提供するプロバイダー。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 初期化時に現在のセッションを取得
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // 認証状態の変化（ログイン、ログアウト、セッション更新など）を購読
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // クリーンアップ時に購読を解除
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    /**
     * ログアウト処理
     */
    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * useAuth: 認証状態にアクセスするためのカスタムフック。
 */
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
