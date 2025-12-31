import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

/**
 * ZK Proofを生成するAPIエンドポイント
 */
export async function GET() {
  return NextResponse.json({
    message: "ZK Proof Generation API is running",
    endpoints: {
      POST: "/api/generate-proof",
      description: "Generate ZK proof from password"
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    // snarkjsをdynamic importで読み込み
    const snarkjs = await import("snarkjs")

    const { passwordNumber } = await request.json()

    if (!passwordNumber || typeof passwordNumber !== "string") {
      return NextResponse.json({ error: "パスワードが無効です" }, { status: 400 })
    }

    // 回路の入力データを作成
    const input = {
      password: passwordNumber,
      hash: process.env.PASSWORD_HASH || ""
    }

    // WAsmファイルとzkeyファイルのパスを設定（publicディレクトリから読み込み）
    const wasmPath = path.join(process.cwd(), "public", "zk", "PasswordHash.wasm")
    const zkeyPath = path.join(process.cwd(), "public", "zk", "PasswordHash_final.zkey")

    // ファイルの存在確認
    if (!fs.existsSync(wasmPath)) {
      console.error("WASM file not found:", wasmPath)
      return NextResponse.json({ error: "WASM ファイルが見つかりません" }, { status: 500 })
    }

    if (!fs.existsSync(zkeyPath)) {
      console.error("zkey file not found:", zkeyPath)
      return NextResponse.json({ error: "zkey ファイルが見つかりません" }, { status: 500 })
    }

    // プルーフを生成
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath)

    // プルーフをフォーマット（コントラクト用）
    const solidityProof = {
      a: [proof.pi_a[0], proof.pi_a[1]],
      b: [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]]
      ],
      c: [proof.pi_c[0], proof.pi_c[1]]
    }

    return NextResponse.json({
      success: true,
      data: {
        proof: solidityProof,
        publicSignals: publicSignals
      }
    })
  } catch (error) {
    console.error("プルーフ生成エラー:", error)
    return NextResponse.json({ error: "プルーフの生成に失敗しました" }, { status: 500 })
  }
}
