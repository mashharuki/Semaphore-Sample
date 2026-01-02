# Project Structure

## Organization Philosophy

**Workspace-First Monorepo**: 各アプリケーション（contracts、web-app、aa-gasless-sample）を独立したワークスペースとして配置し、ルートの `package.json` で統合管理。各ワークスペースは独自のビルドツール・依存関係を持ちながら、共通の開発体験（lint、prettier）を継承。

## Directory Patterns

### モノレポルート
**Location**: `/`
**Purpose**: 全ワークスペース共通の設定とタスクランナー
**Example**:
```
package.json         # Workspaces定義、共通スクリプト
.prettierrc.json     # 共通コードフォーマット
.env.example         # 環境変数テンプレート
.kiro/               # プロジェクト知識ベース（steering、specs）
```

### スマートコントラクト
**Location**: `apps/contracts/`
**Purpose**: Semaphore 連携コントラクトとデプロイタスク
**Example**:
```
contracts/
  Feedback.sol       # メインコントラクト
tasks/
  deploy.ts          # Hardhat デプロイタスク
  resetContractAddressesJson.ts
test/                # Hardhat テストスイート
hardhat.config.ts    # Network設定（sepolia、baseSepolia）
```

### Web アプリ（Next.js App Router）
**Location**: `apps/web-app/`
**Purpose**: Semaphore フィードバックアプリ UI
**Example**:
```
src/
  app/               # Next.js App Router ページ
    api/             # Route Handlers（join、feedback）
    group/           # グループ管理ページ
    proofs/          # 証明履歴ページ
  context/           # React Context（SemaphoreContext、AuthContext）
  hooks/             # カスタムフック（useSemaphoreIdentity）
  components/        # 再利用可能UIコンポーネント
  utils/             # ヘルパー関数（supabase、shortenString）
contract-artifacts/  # デプロイ済みコントラクトABI
```

### AA ガスレスサンプル
**Location**: `apps/aa-gasless-sample/`
**Purpose**: Account Abstraction 統合デモ
**Example**:
```
app/               # Next.js App Router
  dashboard/       # メインUI
  api/             # バックエンド API
providers/         # Privy、Biconomy プロバイダー
components/
  ui/              # shadcn/ui コンポーネント
  layout/          # レイアウトコンポーネント
types/             # 型定義（snarkjs.d.ts）
```

## Naming Conventions

- **Files**:
  - React コンポーネント: `PascalCase.tsx` (例: `PageContainer.tsx`)
  - ユーティリティ: `camelCase.ts` (例: `shortenString.ts`)
  - Solidity: `PascalCase.sol` (例: `Feedback.sol`)
  - Hardhat タスク: `camelCase.ts` (例: `deploy.ts`)
- **Components**: PascalCase（`Stepper`、`Auth`）
- **Functions**: camelCase（`joinGroup`、`sendFeedback`）
- **Constants**: UPPER_SNAKE_CASE（環境変数など）

## Import Organization

### Web App（Next.js）
```typescript
// 1. 外部ライブラリ
import { useContext } from 'react'
import { Identity } from '@semaphore-protocol/core'

// 2. エイリアス（@/ = ./src/）
import { SemaphoreContext } from '@/context/SemaphoreContext'
import { shortenString } from '@/utils/shortenString'

// 3. 相対パス（同一ディレクトリ）
import styles from './page.module.css'
```

**Path Aliases**:
- `@/`: `./src/` にマッピング（全 Next.js ワークスペース共通）

### Contracts（Hardhat）
```typescript
// OpenZeppelin やプロトコルライブラリは直接 import
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

// タスク内では相対パスで内部モジュール参照
import { task } from "hardhat/config"
```

## Code Organization Principles

### 責務分離
- **Contracts**: ビジネスロジックとゼロ知識証明の検証のみ（状態管理はSemaphore Core に委譲）
- **Context**: グローバル状態（アイデンティティ、メンバーリスト）は React Context で管理
- **API Routes**: オフチェーンロジック（Supabase 連携、ログ記録）を Route Handlers に集約
- **Utils**: ピュアな関数（文字列処理、型変換）のみ

### 依存方向
- Frontend → Contract（ethers.js 経由のコントラクト呼び出し）
- Contract → Semaphore Core（プロトコル依存）
- Context → Hooks → Components（単方向データフロー）

### 環境変数管理
- ルートの `.env` をすべてのワークスペースで共有
- コントラクトは `DEFAULT_NETWORK`、`INFURA_API_KEY` を参照
- フロントエンドは `NEXT_PUBLIC_*` プレフィックス必須（ブラウザ公開用）

---
_created_at: 2025-12-31_
