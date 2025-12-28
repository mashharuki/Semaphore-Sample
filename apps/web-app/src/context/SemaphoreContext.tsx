"use client"

import { SemaphoreEthers } from "@semaphore-protocol/data"
import { decodeBytes32String, toBeHex } from "ethers"
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"

// SemaphoreContextType: コンテキストで共有されるデータの型定義
export type SemaphoreContextType = {
    _users: string[] // グループに参加しているユーザー（Identity Commitment）のリスト
    _feedback: string[] // 送信されたフィードバック（メッセージ）のリスト
    refreshUsers: () => Promise<void> // メンバーリストを最新の状態に更新する関数
    addUser: (user: string) => void // ローカルの状態にユーザーを一時的に追加する関数
    refreshFeedback: () => Promise<void> // フィードバックリストを最新の状態に更新する関数
    addFeedback: (feedback: string) => void // ローカルの状態にフィードバックを一時的に追加する関数
}

const SemaphoreContext = createContext<SemaphoreContextType | null>(null)

interface ProviderProps {
    children: ReactNode
}

// 接続先のイーサリアムネットワーク。ローカル開発時は localhost、それ以外は環境変数の値を使用。
const ethereumNetwork =
    process.env.NEXT_PUBLIC_DEFAULT_NETWORK === "localhost"
        ? "http://127.0.0.1:8545"
        : process.env.NEXT_PUBLIC_DEFAULT_NETWORK

export const SemaphoreContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [_users, setUsers] = useState<any[]>([])
    const [_feedback, setFeedback] = useState<string[]>([])

    // refreshUsers: Semaphoreグループのメンバー一覧をコントラクトから取得します。
    const refreshUsers = useCallback(async (): Promise<void> => {
        const semaphore = new SemaphoreEthers(ethereumNetwork, {
            address: process.env.NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS,
            projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY
        })

        // 指定されたグループIDのメンバーを取得
        const members = await semaphore.getGroupMembers(process.env.NEXT_PUBLIC_GROUP_ID as string)

        setUsers(members.map((member) => member.toString()))
    }, [])

    const addUser = useCallback(
        (user: any) => {
            setUsers([..._users, user])
        },
        [_users]
    )

    // refreshFeedback: 検証済みの証明（フィードバック）の一覧をコントラクトから取得します。
    const refreshFeedback = useCallback(async (): Promise<void> => {
        const semaphore = new SemaphoreEthers(ethereumNetwork, {
            address: process.env.NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS,
            projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY
        })

        // 指定されたグループの検証済み証明を取得
        const proofs = await semaphore.getGroupValidatedProofs(process.env.NEXT_PUBLIC_GROUP_ID as string)

        // message領域（bytes32）に保存されたフィードバック文字列をデコードして取得
        setFeedback(proofs.map(({ message }: any) => decodeBytes32String(toBeHex(message, 32))))
    }, [])

    const addFeedback = useCallback(
        (feedback: string) => {
            setFeedback([..._feedback, feedback])
        },
        [_feedback]
    )

    // コンポーネントのマウント時にデータを初回取得します。
    useEffect(() => {
        refreshUsers()
        refreshFeedback()
    }, [refreshFeedback, refreshUsers])

    return (
        <SemaphoreContext.Provider
            value={{
                _users,
                _feedback,
                refreshUsers,
                addUser,
                refreshFeedback,
                addFeedback
            }}
        >
            {children}
        </SemaphoreContext.Provider>
    )
}

// useSemaphoreContext: どこからでもコンテキストのデータにアクセスできるようにするカスタムフック
export const useSemaphoreContext = () => {
    const context = useContext(SemaphoreContext)
    if (context === null) {
        throw new Error("SemaphoreContext must be used within a SemaphoreContextProvider")
    }
    return context
}
