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

**Supabaseマイグレーション**:
- `cd apps/web-app && supabase db push`: マイグレーションをSupabaseに適用
- `cd apps/web-app && supabase db reset`: データベースをリセット（開発環境のみ）
- `cd apps/web-app && supabase migration new <name>`: 新しいマイグレーションファイルを作成

### apps/aa-gasless-sample

**開発・ビルド**:
- `yarn workspace aa-gasless-sample dev`: 開発サーバーを起動（デフォルト: http://localhost:3000）
- `yarn workspace aa-gasless-sample build`: プロダクションビルドを作成
- `yarn workspace aa-gasless-sample start`: プロダクションサーバーを起動

**品質チェック**:
- `yarn workspace aa-gasless-sample lint`: ESLintでコードを検証
- `yarn workspace aa-gasless-sample type-check`: TypeScriptの型チェックを実行（ビルドなし）

**依存関係の更新**（トラブルシューティング時）:
```bash
# Biconomy SDKの更新
yarn workspace aa-gasless-sample add @biconomy/abstractjs@1.1.20 @biconomy/account@4.6.3

# Privy SDKの更新
yarn workspace aa-gasless-sample add @privy-io/react-auth@latest @privy-io/server-auth@latest

# 必須peer dependenciesの追加
yarn workspace aa-gasless-sample add @rhinestone/module-sdk @safe-global/types-kit
yarn workspace aa-gasless-sample add @metamask/delegation-toolkit@~0.11.0
yarn workspace aa-gasless-sample add @solana-program/system @solana/kit

# lucide-reactの更新（Privyとの互換性）
yarn workspace aa-gasless-sample add lucide-react@latest
```

**環境設定**:

`.env.local`ファイルに以下の環境変数を設定:

```bash
# Privy設定
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
PRIVY_APP_SECRET=your-privy-app-secret

# Biconomy設定
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY=your-bundler-api-key
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=your-paymaster-api-key

# ZK-PROOF NFTコントラクト設定（オプション）
NEXT_PUBLIC_ZKNFT_CONTRACT_ADDRESS=your-contract-address
```

## トラブルシューティングコマンド

### ビルドエラーが発生した場合

```bash
# 1. node_modulesとキャッシュをクリーンアップ
rm -rf node_modules apps/*/node_modules .yarn/cache
yarn cache clean

# 2. 依存関係を再インストール
yarn install

# 3. ビルド
yarn workspace aa-gasless-sample build
```

### 型エラーが発生した場合

```bash
# TypeScriptの型チェックのみ実行（ビルドなし）
yarn workspace aa-gasless-sample type-check
```

### Biconomy関連のエラー

```bash
# Biconomy SDKのバージョンを確認
yarn workspace aa-gasless-sample info @biconomy/abstractjs
yarn workspace aa-gasless-sample info @biconomy/account

# 推奨バージョンに更新
yarn workspace aa-gasless-sample add @biconomy/abstractjs@1.1.20 @biconomy/account@4.6.3
```

## 重要なパス

### Contract関連
- `apps/contracts/outputs/`: ネットワーク別のコントラクトアドレスJSON
  - `contracts-sepolia.json`
  - `contracts-baseSepolia.json`
- `apps/contracts/helper/contractJsonHelper.ts`: コントラクトアドレス管理ユーティリティ

### Frontend関連
- `apps/web-app/src/context/`: Reactコンテキストプロバイダー
- `apps/aa-gasless-sample/components/ui/`: shadcn/ui UIコンポーネント
- `apps/aa-gasless-sample/providers/`: Privy等のプロバイダー
- `apps/aa-gasless-sample/hooks/`: カスタムフック（useBiconomy.tsなど）

### 設定ファイル
- `apps/aa-gasless-sample/.env.local`: 環境変数（Privy、Biconomy APIキー）
- `apps/aa-gasless-sample/next.config.js`: Next.js設定
- `apps/aa-gasless-sample/tailwind.config.js`: Tailwind CSS設定

## よく使うデバッグコマンド

```bash
# ブラウザのコンソールログを確認しながら開発
yarn workspace aa-gasless-sample dev

# ビルドの詳細ログを表示
yarn workspace aa-gasless-sample build --debug

# 特定のファイルの型チェック
yarn tsc --noEmit apps/aa-gasless-sample/hooks/useBiconomy.ts
```
