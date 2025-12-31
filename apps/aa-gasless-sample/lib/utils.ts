import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * クラス名をマージするユーティリティ関数
 *
 * @param inputs マージするクラス名の配列
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NEXUS_IMPLEMENTATION = "0x000000004F43C49e93C970E84001853a70923B03"

export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

// ZKNFTコントラクトのアドレス
export const ZKNFT_CONTRACT_ADDRESS = "0xa9Bf293B85E46079665019BE17a67B8D925572f7"
