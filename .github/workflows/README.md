# GitHub Actions Workflows

このディレクトリには、Semaphore Sample プロジェクトの GitHub Actions ワークフローが含まれています。

## ワークフロー一覧

### 1. CI (`ci.yml`)

**トリガー:** `main`, `develop` ブランチへのプッシュとプルリクエスト

継続的インテグレーションワークフローで、コードの品質を保証します。

**ジョブ:**
- **lint**: ESLint と Prettier によるコード品質チェック
- **test-contracts**: スマートコントラクトのテスト実行とガスレポート生成
- **build-web-app**: Next.js Web アプリのビルド検証

**必要な環境変数:**
- なし（デフォルト値を使用）

---

### 2. Deploy Contracts (`deploy-contracts.yml`)

**トリガー:** 手動実行（workflow_dispatch）

スマートコントラクトを指定されたネットワークにデプロイします。

**入力パラメータ:**
- `network`: デプロイ先ネットワーク（sepolia, mainnet, localhost）
- `semaphore_address`: Semaphore コントラクトアドレス

**必要なシークレット:**
- `ETHEREUM_PRIVATE_KEY`: デプロイ用の秘密鍵
- `ETHERSCAN_API_KEY`: Etherscan 検証用 API キー

**成果物:**
- デプロイされたコントラクトの artifacts と deployments ディレクトリ

---

### 3. Deploy Web App (`deploy-web-app.yml`)

**トリガー:** 
- `main` ブランチへのプッシュ（apps/web-app 配下の変更時）
- 手動実行（workflow_dispatch）

Next.js Web アプリを Vercel にデプロイします。

**必要なシークレット:**
- `VERCEL_TOKEN`: Vercel API トークン
- `VERCEL_ORG_ID`: Vercel 組織 ID
- `VERCEL_PROJECT_ID`: Vercel プロジェクト ID
- `NEXT_PUBLIC_DEFAULT_NETWORK`: デフォルトネットワーク
- `NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS`: Feedback コントラクトアドレス
- `NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS`: Semaphore コントラクトアドレス
- `NEXT_PUBLIC_GROUP_ID`: グループ ID
- `NEXT_PUBLIC_INFURA_API_KEY`: Infura API キー（本番環境のみ）
- `NEXT_PUBLIC_OPENZEPPELIN_AUTOTASK_WEBHOOK`: OpenZeppelin Autotask Webhook（本番環境のみ）
- `NEXT_PUBLIC_GELATO_RELAYER_ENDPOINT`: Gelato Relayer エンドポイント（本番環境のみ）
- `NEXT_PUBLIC_GELATO_RELAYER_CHAIN_ID`: Gelato Relayer チェーン ID（本番環境のみ）

---

### 4. Code Quality & Security (`code-quality.yml`)

**トリガー:**
- `main`, `develop` ブランチへのプッシュとプルリクエスト
- 毎週月曜日 00:00 UTC（スケジュール実行）

コードの品質とセキュリティをチェックします。

**ジョブ:**
- **dependency-review**: 依存関係のレビュー（PR のみ）
- **codeql-analysis**: CodeQL によるセキュリティ分析
- **contract-security**: Slither によるスマートコントラクトのセキュリティ分析
- **audit-dependencies**: yarn audit による依存関係の脆弱性チェック

**必要な権限:**
- `security-events: write` (CodeQL)

---

### 5. Release (`release.yml`)

**トリガー:** バージョンタグ（`v*.*.*`）のプッシュ

自動的に GitHub リリースを作成します。

**処理内容:**
1. 依存関係のインストール
2. テストとビルドの実行
3. 変更履歴の生成
4. GitHub リリースの作成

**必要な権限:**
- `contents: write`

---

## セットアップ手順

### 1. リポジトリシークレットの設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください：

#### コントラクトデプロイ用:
- `ETHEREUM_PRIVATE_KEY`
- `ETHERSCAN_API_KEY`

#### Web アプリデプロイ用（Vercel）:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_DEFAULT_NETWORK`
- `NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_GROUP_ID`
- `NEXT_PUBLIC_INFURA_API_KEY`
- `NEXT_PUBLIC_OPENZEPPELIN_AUTOTASK_WEBHOOK`
- `NEXT_PUBLIC_GELATO_RELAYER_ENDPOINT`
- `NEXT_PUBLIC_GELATO_RELAYER_CHAIN_ID`

### 2. 環境の設定（オプション）

コントラクトデプロイワークフローで環境を使用する場合：

1. Settings > Environments で環境（sepolia, mainnet など）を作成
2. 各環境に必要なシークレットを設定

### 3. ブランチ保護ルールの設定（推奨）

Settings > Branches で `main` と `develop` ブランチに保護ルールを設定：

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - 必須チェック: `Lint`, `Test Smart Contracts`, `Build Next.js Web App`
- ✅ Require branches to be up to date before merging

---

## トラブルシューティング

### ワークフローが失敗する場合

1. **依存関係のインストールエラー**
   - `yarn.lock` が最新であることを確認
   - ローカルで `yarn install` が成功することを確認

2. **ビルドエラー**
   - 環境変数が正しく設定されているか確認
   - ローカルで同じコマンドが成功することを確認

3. **デプロイエラー**
   - 必要なシークレットがすべて設定されているか確認
   - ネットワーク接続と API キーの有効性を確認

---

## ローカルでのテスト

GitHub Actions を使用する前に、ローカルで以下のコマンドを実行してテストしてください：

```bash
# リント
yarn lint
yarn prettier

# コントラクトテスト
yarn workspace monorepo-ethers-contracts compile
yarn workspace monorepo-ethers-contracts test

# Web アプリビルド
yarn workspace monorepo-ethers-web-app build
```

---

## 参考リンク

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Semaphore Documentation](https://docs.semaphore.pse.dev/)
