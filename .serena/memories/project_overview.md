# Project Overview: Semaphore-Sample

このプロジェクトは、Semaphore Protocolを使用したアプリケーションを構築するためのmonorepoテンプレートです。匿名グループメンバーシップとシグナルブロードキャスト（フィードバック）の基本的なユースケースを実証しています。

## Tech Stack

- **Monorepo Manager**: Yarn 4 (Berry)
- **Programming Language**: TypeScript
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Next.js (App Router), React, Vanilla CSS
- **Backend/Auth**: Supabase (Auth, PostgreSQL)
- **Protocol**: Semaphore Protocol
- **Client Library**: SemaphoreEthers

## 認証フロー

- **Exclusive Web3 Wallet Login**: Supabase経由でEthereumウォレット認証のみをサポート
- **Identity Recovery**: Semaphore Identity（秘密鍵）はSupabaseの`identities`テーブルに保存され、ログイン成功時に自動復元
- **Identity Protection**: UIはログイン済みユーザーに既存のIdentityがある場合、再生成を防止

## Multi-Package Structure

### apps/contracts
スマートコントラクトの開発、テスト、デプロイメント。

**主要機能**:
- Feedback.sol: Semaphoreプロトコルを使用した匿名フィードバックコントラクト
- contractJsonHelper.ts: コントラクトアドレス管理ユーティリティ
- Hardhatタスク: デプロイ、検証、アドレス管理
- デプロイメントJSON: Sepolia、Base Sepoliaなど複数ネットワーク対応

### apps/web-app
Next.jsフロントエンドアプリケーション。Semaphoreプロトコルを使用した匿名フィードバックシステムのUI。

**主要機能**:
- Semaphore Identity管理（生成、保存、復元）
- グループ参加とメンバーシップ管理
- 匿名フィードバック送信（ZK-Proof生成・検証）
- Supabase統合による認証とデータ永続化

### apps/aa-gasless-sample
**Biconomy + Privy統合によるAccount Abstraction（AA）とガスレストランザクションのサンプル実装**

#### 主要機能
- **Privy統合認証**: Embedded Walletによるウォレット接続
- **Biconomy Smart Account**: Account Abstraction実装（ERC-4337準拠）
- **ガスレストランザクション**: Paymaster APIによるガススポンサーシップ
- **ZK-Proof NFTミント**: ゼロ知識証明を使用したNFTミント機能

#### アーキテクチャ
```
Privy Embedded Wallet (EOA)
    ↓ EIP-1193 Provider
Biconomy Nexus Account (Smart Account)
    ↓ User Operation
Bundler → EntryPoint → Target Contract
    ↑ Gas Sponsorship
Paymaster
```

#### 使用技術スタック
- **認証**: @privy-io/react-auth v3.10.0
- **AA実装**: 
  - @biconomy/abstractjs v1.1.20
  - @biconomy/account v4.6.3
- **Blockchain通信**: 
  - ethers v6.9.0
  - viem v2.31.0
- **ZK-Proof**: 
  - snarkjs v0.6.9
  - circomlibjs v0.1.7
- **UI**: Next.js 14 + shadcn/ui + Tailwind CSS

#### 重要な実装詳細

**Biconomy Nexus Account初期化**:
```typescript
const provider = await embeddedWallet.getEthereumProvider()

const nexusClient = createSmartAccountClient({
  account: await toNexusAccount({
    signer: provider as any, // EIP-1193 provider
    chainConfiguration: {
      chain: baseSepolia,
      transport: http(),
      version: getMEEVersion(MEEVersion.V2_1_0)
      // 注意: accountAddressは通常設定しない（EIP-7702専用）
    }
  }),
  chain: baseSepolia,
  transport: http(bundlerUrl),
  paymaster: createBicoPaymasterClient({ paymasterUrl })
})
```

**重要な注意事項**:
- `accountAddress`パラメータはEIP-7702（EOAへのSmart Account機能追加）専用
- 通常のNexus Account作成では`accountAddress`を指定しない
- PrivyのEmbedded Walletは、EIP-1193 providerを直接signerとして使用
- Smart Accountアドレスは、signerから決定論的に計算される（CREATE2）

#### 依存関係の注意点
Biconomy AbstractJS v1.1.20で必要なpeer dependencies:
- @rhinestone/module-sdk
- @safe-global/types-kit
- @metamask/delegation-toolkit (~0.11.0を使用)
- @solana-program/system
- @solana/kit

## よくあるエラーと解決方法

### AA14 initCode must return sender
**原因**: Smart Accountのアドレス計算の不一致
**解決**: `accountAddress`パラメータを削除（通常のNexus Accountでは不要）

### SMART_SESSIONS_ADDRESS is not exported
**原因**: Biconomy AbstractJSのバージョンが古い
**解決**: @biconomy/abstractjs を v1.1.20以上に更新

### UnauthorizedProviderError
**原因**: Signerの統合が不適切
**解決**: Privyのproviderを直接signerとして使用

## 開発ガイドライン

プロジェクトでは、CLAUDE.md → AGENTS.mdで定義された**Spec駆動開発 ✖️ テスト駆動開発**の方針を採用しています。

### 基本理念
- 動くコードだけでなく、品質・保守性・安全性を常に意識
- エラーは抑制せず根本原因を修正
- DRY原則とコード品質の維持
- テストをスキップせず、振る舞いをテスト
- セキュリティとパフォーマンスの意識

### Git運用
- コンベンショナルコミット形式（feat:, fix:, docs:, test:, refactor:, chore:）
- 英語でのコミットメッセージ
- main/masterブランチへの直接コミット回避
