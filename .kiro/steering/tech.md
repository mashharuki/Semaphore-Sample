# Technology Stack

## Architecture

モノレポ構成（Yarn Workspaces）による、スマートコントラクト、フロントエンド、AA統合のマルチプロジェクト構成。各ワークスペースは独立したビルドとデプロイが可能で、共通の開発ツールチェーンを共有。

## Core Technologies

- **Language**: TypeScript, Solidity (0.8.23)
- **Framework**: Next.js (14.x), Hardhat (2.x)
- **Runtime**: Node.js 20+
- **Package Manager**: Yarn Berry v4

## Key Libraries

### スマートコントラクト
- **@semaphore-protocol/contracts**: ゼロ知識証明ベースの匿名性プロトコル
- **Hardhat Toolbox**: コントラクト開発、テスト、デプロイ環境

### フロントエンド（web-app）
- **@semaphore-protocol/core**: Semaphore アイデンティティ管理とプルーフ生成
- **ethers.js v6**: ブロックチェーン通信
- **@supabase/supabase-js**: 状態管理とデータ永続化

### AA統合（aa-gasless-sample）
- **@biconomy/account**: アカウントアブストラクション実装
- **@privy-io/react-auth**: Web3 認証とウォレット管理
- **@metamask/delegation-toolkit**: ERC-7710 委任フレームワーク
- **viem**: モダンな型安全 Ethereum ライブラリ
- **Tailwind CSS + shadcn/ui**: UIコンポーネント

## Development Standards

### Type Safety
- TypeScript strict mode 有効
- Solidity 型チェック（Typechain で自動生成）
- `any` の使用は可能な限り避ける

### Code Quality
- **ESLint**: Airbnb ベース（contracts）、Next.js 推奨（frontend）
- **Prettier**: コード整形（Solidity plugin 含む）
- **Solhint**: Solidity 静的解析

### Testing
- **Hardhat Test**: Chai + Ethers によるコントラクトテスト
- **Coverage**: `hardhat coverage` でカバレッジ測定
- Gas レポート機能あり（`REPORT_GAS=true`）

## Development Environment

### Required Tools
- Node.js 20+
- Yarn Berry 4.1.0
- Git

### Common Commands
```bash
# Dev (全ワークスペース並列起動)
yarn dev

# Dev (個別ワークスペース)
yarn dev:web-app
yarn dev:contracts

# Lint & Format
yarn lint
yarn prettier
yarn prettier:write

# Contract (apps/contracts 配下)
yarn contracts compile
yarn contracts test
yarn contracts deploy --network <network>
```

## Key Technical Decisions

### Semaphore Protocol の選定理由
- Ethereum Foundation PSE チームによるメンテナンス
- zkSNARK ベースのプロダクション実績
- グループベース匿名性と Nullifier による二重送信防止のバランス

### Yarn Berry Workspaces
- ワークスペース間の依存管理が簡潔
- Zero-Install（Plug'n'Play）による高速セットアップ
- モノレポでの並列ビルド・テストに対応

### Account Abstraction の統合
- Biconomy SDK による ERC-4337 スマートアカウント実装
- Privy による Web2 ライクな認証体験
- ガスレストランザクションによる UX 向上

### TypeScript 統一
- コントラクト、フロントエンド、タスクすべて TypeScript
- 型定義の共有と一貫性
- Typechain による自動型生成でコントラクトとフロントエンドの型安全性確保

---
_created_at: 2025-12-31_
