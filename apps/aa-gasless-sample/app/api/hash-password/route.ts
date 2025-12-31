import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
// @ts-ignore
const circomlibjs = require("circomlibjs")

/**
 * パスワードをハッシュ化するAPIエンドポイント
 */
export async function GET() {
  return NextResponse.json({
    message: "Password Hash API is running",
    endpoints: {
      POST: "/api/hash-password",
      description: "Hash password using Poseidon"
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "パスワードが無効です" }, { status: 400 })
    }

    // Poseidonハッシュ関数をビルド
    const poseidon = await circomlibjs.buildPoseidon()

    // パスワードをバイト配列に変換してからBigIntに変換
    const passwordBytes = Buffer.from(password, "utf8")
    const passwordNumber = BigInt(`0x${passwordBytes.toString("hex")}`)

    // Poseidonハッシュを計算
    const hash = poseidon.F.toString(poseidon([passwordNumber]))

    return NextResponse.json({
      success: true,
      data: {
        originalPassword: password,
        passwordNumber: passwordNumber.toString(),
        hash: hash
      }
    })
  } catch (error) {
    console.error("パスワードハッシュ化エラー:", error)
    return NextResponse.json({ error: "パスワードのハッシュ化に失敗しました" }, { status: 500 })
  }
}
