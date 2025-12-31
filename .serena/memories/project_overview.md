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
Biconomy + Privyを使用したAccount Abstraction（AA）とガスレストランザクションのサンプル実装。

**主要機能**:
- Privy統合による認証（ウォレット接続）
- Biconomy Smart Accountによるアカウントアブストラクション
- ガスレストランザクション実装例
- Next.js 14 + App Router + shadcn/ui

**使用技術**:
- @privy-io/react-auth: 認証プロバイダー
- @biconomy/account, @biconomy/abstractjs: AA実装
- ethers v6, viem: ブロックチェーン通信
- snarkjs, circomlibjs: ゼロ知識証明サポート

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
