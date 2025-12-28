import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * useSemaphoreIdentity: ブラウザのローカルストレージからSemaphoreアイデンティティを読み込むカスタムフック。
 * アイデンティティが存在しない場合はトップページにリダイレクトします。
 */
export default function useSemaphoreIdentity() {
    const router = useRouter()
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        // ローカルストレージから保存された秘密鍵を取得
        const privateKey = localStorage.getItem("identity")

        if (!privateKey) {
            // アイデンティティがない場合はトップページへ戻す（セキュリティとフローの担保）
            router.push("/")
            return
        }

        // 秘密鍵からIdentityオブジェクトを復元して状態として保持
        setIdentity(new Identity(privateKey))
    }, [router])

    return {
        _identity
    }
}
