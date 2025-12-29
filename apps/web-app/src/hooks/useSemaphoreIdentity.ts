import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../utils/supabase"

/**
 * useSemaphoreIdentity:
 * SupabaseからSemaphoreアイデンティティを読み込むカスタムフック。
 * アイデンティティが存在しない場合はトップページにリダイレクトします。
 */
export default function useSemaphoreIdentity() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [_identity, setIdentity] = useState<Identity>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchIdentity = async () => {
            // 認証情報の読み込み中は何もしない
            if (authLoading) return

            // 未ログインの場合はトップページ（Identity作成ページ）へ
            if (!user) {
                router.push("/")
                return
            }

            // Supabaseのidentitiesテーブルから、ログイン中ユーザーに対応する秘密鍵を取得
            const { data, error } = await supabase
                .from("identities")
                .select("private_key")
                .eq("user_id", user.id)
                .single()

            if (error || !data) {
                // アイデンティティが未作成の場合はトップページへ
                router.push("/")
                return
            }

            // 取得した秘密鍵からIdentityオブジェクトを復元
            setIdentity(new Identity(data.private_key))
            setLoading(false)
        }

        fetchIdentity()
    }, [router, user, authLoading])

    return {
        _identity,
        loading: authLoading || loading
    }
}
