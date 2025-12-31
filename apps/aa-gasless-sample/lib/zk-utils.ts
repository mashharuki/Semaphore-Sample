/**
 * パスワードハッシュ化の結果の型定義
 */
export interface HashPasswordResponse {
  success: boolean
  data?: {
    originalPassword: string
    passwordNumber: string
    hash: string
  }
  error?: string
}

/**
 * プルーフ生成の結果の型定義
 */
export interface GenerateProofResponse {
  success: boolean
  data?: {
    proof: {
      a: [string, string]
      b: [[string, string], [string, string]]
      c: [string, string]
    }
    publicSignals: string[]
    originalInput: {
      password: string
      passwordHash: string
    }
    passwordHash: string
  }
  error?: string
}

/**
 * パスワードをハッシュ化する関数
 *
 * @param password ハッシュ化するパスワード
 * @returns ハッシュ化の結果
 */
export async function hashPassword(password: string): Promise<HashPasswordResponse> {
  try {
    const response = await fetch("/api/hash-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("パスワードハッシュ化エラー:", error)
    return {
      success: false,
      error: "パスワードのハッシュ化に失敗しました"
    }
  }
}

/**
 * ZK Proofを生成する関数
 *
 * @param password プルーフ生成に使用するパスワード
 * @returns プルーフ生成の結果
 */
export async function generateProof(passwordNumber: bigint): Promise<GenerateProofResponse> {
  try {
    // APIを呼び出す
    const response = await fetch("/api/generateProof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ passwordNumber })
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("error create proof:", error)
    return {
      success: false,
      error: "プルーフの生成に失敗しました"
    }
  }
}
