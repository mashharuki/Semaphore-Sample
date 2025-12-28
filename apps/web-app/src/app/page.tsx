"use client"

import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import { useLogContext } from "../context/LogContext"

// IdentitiesPage: ユーザーのSemaphoreアイデンティティを作成・表示するページ
export default function IdentitiesPage() {
    const router = useRouter()
    const { setLog } = useLogContext()
    const [_identity, setIdentity] = useState<Identity>()

    // コンポーネント読み込み時に、ローカルストレージに既存のアイデンティティがあるか確認
    useEffect(() => {
        const privateKey = localStorage.getItem("identity")

        if (privateKey) {
            // 既存の秘密鍵があればインポートして復元
            const identity = Identity.import(privateKey)

            setIdentity(identity)

            setLog("Your Semaphore identity has been retrieved from the browser cache 👌🏽")
        } else {
            setLog("Create your Semaphore identity 👆🏽")
        }
    }, [setLog])

    // createIdentity: 新しいSemaphoreアイデンティティを生成し、ローカルストレージに保存
    const createIdentity = useCallback(async () => {
        // 全く新しい秘密鍵を持つアイデンティティを作成
        const identity = new Identity()

        setIdentity(identity)

        // 秘密鍵をエクスポートしてブラウザに保存（これにより再訪問時も同じアイデンティティを使える）
        localStorage.setItem("identity", identity.export())

        setLog("Your new Semaphore identity has just been created 🎉")
    }, [setLog])

    return (
        <>
            <h2>Identities</h2>

            <p>
                Semaphoreプロトコルにおけるユーザーのアイデンティティ。{" "}
                <a
                    href="https://docs.semaphore.pse.dev/guides/identities"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    Semaphore identity
                </a>{" "}
                は、{" "}
                <a
                    href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/eddsa-poseidon"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    EdDSA
                </a>{" "}
                公開鍵・秘密鍵のペアと、公開識別子として使用される「コミットメント（Commitment）」で構成されます。
            </p>

            <div className="divider" />

            <div className="keys-header">
                <h3>Identity</h3>
            </div>

            {_identity && (
                <div className="key-wrapper">
                    <p>
                        {/* 秘密鍵: 本来は誰にも見せてはいけませんが、デモのために表示しています */}
                        <b>Private Key (base64)</b>:<br /> {_identity.export()}
                    </p>
                    <p>
                        <b>Public Key</b>:<br /> [{_identity.publicKey[0].toString()},{" "}
                        {_identity.publicKey[1].toString()}]
                    </p>
                    <p>
                        {/* コミットメント: オンチェーン（スマートコントラクト）に登録される公開情報 */}
                        <b>Commitment</b>:<br /> {_identity.commitment.toString()}
                    </p>
                </div>
            )}

            <div>
                <button className="button" onClick={createIdentity} type="button">
                    Create identity
                </button>
            </div>

            <div className="divider" />

            {/* 次のステップ（グループ参加）への案内 */}
            <Stepper step={1} onNextClick={_identity && (() => router.push("/group"))} />
        </>
    )
}
