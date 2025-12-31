# Suggested Commands

プロジェクトルートから実行可能なコマンド：

- `yarn`: すべての依存関係をインストール
- `yarn dev`: フロントエンドとローカルHardhatノード/コントラクトを開発モードで起動
- `yarn dev:web-app`: Next.jsフロントエンドのみを起動
- `yarn dev:contracts`: Hardhat環境のみを起動
- `yarn lint`: すべてのパッケージでESLintとSolhintを実行
- `yarn prettier`: コードフォーマットをチェック
- `yarn prettier:write`: コードフォーマットの問題を自動修正

## Package-Specific Commands

### apps/contracts

**テストとコンパイル**:
- `yarn workspace monorepo-ethers-contracts hardhat test`: スマートコントラクトのテストを実行
- `yarn workspace monorepo-ethers-contracts hardhat compile`: スマートコントラクトをコンパイル

**デプロイメント**:
- `yarn workspace monorepo-ethers-contracts deploy --semaphore <address> --network sepolia`: Sepoliaにデプロイ
- `yarn workspace monorepo-ethers-contracts deploy --semaphore <address> --network baseSepolia`: Base Sepoliaにデプロイ

**検証**:
- `yarn workspace monorepo-ethers-contracts verify <contract-address> <constructor-args> --network sepolia`: Sepoliaでコントラクトを検証
- `yarn workspace monorepo-ethers-contracts verify <contract-address> <constructor-args> --network baseSepolia`: Base Sepoliaでコントラクトを検証

**Hardhatタスク**:
- `yarn workspace monorepo-ethers-contracts hardhat reset-contract-addresses --network <network>`: コントラクトアドレスJSONをリセット

### apps/web-app

- `yarn workspace monorepo-ethers-web-app dev`: フロントエンド開発サーバーを起動
- `yarn workspace monorepo-ethers-web-app build`: プロダクションビルドを作成
- `yarn workspace monorepo-ethers-web-app start`: プロダクションサーバーを起動

### apps/aa-gasless-sample

**開発**:
- `yarn workspace aa-gasless-sample dev`: 開発サーバーを起動（デフォルト: http://localhost:3000）
- `yarn workspace aa-gasless-sample build`: プロダクションビルドを作成
- `yarn workspace aa-gasless-sample start`: プロダクションサーバーを起動

**品質チェック**:
- `yarn workspace aa-gasless-sample lint`: ESLintでコードを検証
- `yarn workspace aa-gasless-sample type-check`: TypeScriptの型チェックを実行（ビルドなし）

**環境設定**:
- `.env.local`ファイルに以下の環境変数を設定:
  - `NEXT_PUBLIC_PRIVY_APP_ID`: Privy App ID
  - `PRIVY_APP_SECRET`: Privy App Secret（サーバーサイド）
  - その他、Biconomy設定など

## 重要なパス

- `apps/contracts/outputs/`: ネットワーク別のコントラクトアドレスJSON
  - `contracts-sepolia.json`
  - `contracts-baseSepolia.json`
- `apps/contracts/helper/contractJsonHelper.ts`: コントラクトアドレス管理ユーティリティ
- `apps/web-app/src/context/`: Reactコンテキストプロバイダー
- `apps/aa-gasless-sample/components/ui/`: shadcn/ui UIコンポーネント
- `apps/aa-gasless-sample/providers/`: Privy等のプロバイダー
