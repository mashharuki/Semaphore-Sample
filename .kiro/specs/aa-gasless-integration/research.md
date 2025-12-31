# Research & Design Decisions

## Summary
- **Feature**: `aa-gasless-integration`
- **Discovery Scope**: Complex Integration（既存システム拡張 + 新技術統合）
- **Key Findings**:
  - Privy React SDK v3.10.0以降はBase Sepolia（chain ID 84532）を公式サポート、エンベデッドウォレット自動作成機能あり
  - Biconomy AbstractJS（@biconomy/abstractjs v1.1.20）はNexus Accountによる最新のAA実装を提供
  - viem v2はBase Sepoliaをビルトインサポート、ethers.jsより型安全性とパフォーマンスが優れる

## Research Log

### Privy Embedded Wallet Configuration
- **Context**: Privy認証とエンベデッドウォレットの設定方法を調査
- **Sources Consulted**:
  - [Privy Embedded Wallet Creation](https://docs.privy.io/guide/react/wallets/embedded/creation)
  - [Privy React SDK Changelog](https://docs.privy.io/reference/sdk/react-auth/changelog)
  - [Using Base Sub Accounts - Privy Docs](https://docs.privy.io/recipes/react/external-wallets/base-sub-accounts)
- **Findings**:
  - `createOnLogin`オプション:
    - `'all-users'`: 全ユーザーにウォレット作成
    - `'users-without-wallets'`: ウォレット未保有ユーザーのみ作成（推奨）
    - `'off'`: 自動作成無効（デフォルト）
  - Base Sepoliaサポート: `supportedChains: [baseSepolia]`で有効化
  - エンベデッドウォレットの切り替え: `await embeddedWallet.switchChain(84532)`
  - モーダルベースログインのみ自動作成対応（`loginWithCode`等は非対応）
- **Implications**:
  - `createOnLogin: 'users-without-wallets'`を採用し、既存ユーザー保護
  - Base Sepolia明示的設定が必要

### Biconomy Account Abstraction on Base Sepolia
- **Context**: Biconomyのスマートアカウント、Paymaster、Bundler統合方法を調査
- **Sources Consulted**:
  - [Account Abstraction on Base using Biconomy - Base Documentation](https://docs.base.org/learn/onchain-app-development/account-abstraction/account-abstraction-on-base-using-biconomy)
  - [Biconomy Overview](https://docs.biconomy.io/smartAccountsV2/overview/)
  - [Account abstraction with Biconomy | Privy Docs](https://docs.privy.io/guide/react/recipes/account-abstraction/biconomy)
- **Findings**:
  - **Nexus Account**: `@biconomy/abstractjs`の`toNexusAccount`でスマートアカウント作成
  - **Paymaster**: Biconomy Dashboardで登録、APIキーとURLを取得
    - Gas Tankへの資金供給が必要
    - 契約アドレスとメソッドのホワイトリスト設定
  - **Bundler**: Biconomy DashboardからBundler URLとAPIキー取得
  - **Base Sepolia**: Chain ID 84532で完全サポート
  - **依存関係**: `@biconomy/abstractjs`, `@biconomy/account`, `viem`
  - **aa-gasless-sampleの実装パターン**:
    ```typescript
    const nexusClient = createSmartAccountClient({
      account: await toNexusAccount({
        signer: provider,
        chainConfiguration: { chain: baseSepolia, transport: http() }
      }),
      paymaster: createBicoPaymasterClient({ paymasterUrl })
    })
    ```
- **Implications**:
  - Biconomy Dashboard設定が前提条件
  - Gas Tank資金管理が運用上の課題
  - Paymasterポリシーでセキュリティ制御可能

### viem vs ethers.js for Smart Contract Interaction
- **Context**: 既存web-appのethers.js v6とaa-gasless-sampleのviemの比較
- **Sources Consulted**:
  - [viem - Base Documentation](https://docs.base.org/learn/onchain-app-development/frontend-setup/viem)
  - [Viem · TypeScript Interface for Ethereum](https://viem.sh/)
  - [Interacting with Smart Contracts on Base L2 with Viem](https://medium.com/@defiboy/interacting-with-smart-contracts-on-base-l2-with-viem-807431516d75)
- **Findings**:
  - **型安全性**: viemはTypeScript-first設計、ethers.jsより厳密な型推論
  - **パフォーマンス**: viemはTree-shakableで軽量、バンドルサイズ削減
  - **Base Sepolia**: viemは`baseSepolia`チェーンをビルトインサポート
  - **Biconomy統合**: aa-gasless-sampleおよびBiconomy公式サンプルはviem使用
  - **コード例**:
    ```typescript
    import { createPublicClient, http } from 'viem'
    import { baseSepolia } from 'viem/chains'

    const client = createPublicClient({
      chain: baseSepolia,
      transport: http()
    })
    ```
- **Implications**:
  - viemへの統一を推奨（Biconomy公式パターンとの整合性）
  - 既存ethers.js v6コードは段階的に置き換え可能
  - ABIの互換性は維持（どちらもJSON ABI使用）

### Semaphore Identity永続化戦略
- **Context**: 既存SupabaseアイデンティティストレージをPrivy移行後にどう扱うか
- **Sources Consulted**:
  - 既存web-app実装（Supabase `identities`テーブル）
  - Privyドキュメント（データストレージ機能調査）
- **Findings**:
  - **既存実装**: Supabase `identities`テーブルに`user_id`, `private_key`, `commitment`を保存
  - **Privyデータストレージ**: Privy自体はアイデンティティ永続化機能なし（認証のみ）
  - **移行オプション**:
    1. Supabase継続使用（Privy user.idをキーに保存）
    2. localStorageのみ（永続性なし）
    3. 独自バックエンドストレージ構築
- **Implications**:
  - **推奨**: Option 1（Supabase継続）
  - 理由: 既存データ移行不要、マルチデバイス対応、既存インフラ活用
  - Privy `user.id`とSupabase `user_id`のマッピングが必要

### UI/UXライブラリ選定
- **Context**: 既存カスタムCSSからTailwind CSS + shadcn/uiへの移行
- **Sources Consulted**:
  - aa-gasless-sample実装
  - shadcn/ui公式ドキュメント
- **Findings**:
  - aa-gasless-sampleはTailwind CSS + shadcn/ui + react-hot-toastを使用
  - shadcn/uiコンポーネント:
    - Button, Card, Input, Label（フォーム系）
    - LoadingSpinner（カスタム実装）
  - ダークテーマ対応、グラスモーフィズム効果
  - 既存PageContainer、Stepperは再利用可能
- **Implications**:
  - Tailwind CSS導入（PostCSS設定）
  - shadcn/ui段階的導入（新規AAページから開始）
  - 既存CSSとの共存期間あり

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| A: サーバーサイドAPI維持 | 既存の/api/join、/api/feedbackを維持、内部をAA化 | 既存フロントエンド変更最小 | クライアントUX悪化、サーバー秘密鍵管理継続 | 非推奨：AA本来のメリット失う |
| B: クライアントサイドAA完全移行 | サーバーAPI削除、全てクライアントサイドでAA実装 | 真のガスレスUX、サーバー秘密鍵不要 | フロントエンド大幅変更、エラーハンドリング複雑化 | 推奨：AA本来の設計思想に合致 |
| C: ハイブリッド（段階的移行） | 新機能はAA、既存APIは暫定維持 | 段階的リスク分散、ロールバック可能 | 過渡期の複雑性、新旧コード混在 | 実装戦略として有効だが最終形はOption B |

**選択**: Option B（クライアントサイドAA完全移行）
**理由**:
- ユーザー体験の向上（即座のフィードバック、トランザクション状態の可視化）
- セキュリティ向上（サーバーに秘密鍵不要）
- AA本来の設計思想に合致
- 実装はOption Cの段階的アプローチで進める

## Design Decisions

### Decision: viem統一採用

- **Context**: 既存web-appはethers.js v6、aa-gasless-sampleはviemを使用
- **Alternatives Considered**:
  1. ethers.js v6維持 — 既存コード影響なし
  2. viem統一 — Biconomy公式パターンと整合
  3. 両方併用 — 混在による複雑性
- **Selected Approach**: viem統一
- **Rationale**:
  - Biconomy公式サンプルおよびドキュメントがviemベース
  - 型安全性とパフォーマンスの向上
  - Base Sepolia組み込みサポート
  - Tree-shakingによるバンドルサイズ削減
- **Trade-offs**:
  - **Benefits**: 型安全性↑、パフォーマンス↑、公式パターン準拠
  - **Compromises**: 既存ethers.jsコードの置き換えが必要
- **Follow-up**: 既存SemaphoreContext内のethers.js使用箇所をviemに段階的移行

### Decision: Supabaseアイデンティティ永続化継続

- **Context**: Privy移行後のSemaphore Identity永続化先
- **Alternatives Considered**:
  1. Supabase継続（Privy user.idをキー）
  2. Privyデータストレージ（機能なし）
  3. localStorage（永続性なし）
- **Selected Approach**: Supabase継続使用
- **Rationale**:
  - 既存データ移行不要
  - マルチデバイス対応
  - 既存インフラ活用
  - Privy認証とSupabaseストレージの責務分離
- **Trade-offs**:
  - **Benefits**: 移行コスト最小、マルチデバイス対応、既存データ活用
  - **Compromises**: Supabase依存継続（完全なPrivy移行ではない）
- **Follow-up**: Privy `user.id`とSupabase `user_id`のマッピング実装

### Decision: Tailwind CSS + shadcn/ui段階的導入

- **Context**: 既存カスタムCSSとaa-gasless-sampleのTailwind CSS + shadcn/ui
- **Alternatives Considered**:
  1. 既存CSS維持 — 変更最小だがUI改善なし
  2. 全面Tailwind移行 — 大規模変更、リスク高
  3. 段階的導入 — 新規AAページから開始
- **Selected Approach**: 段階的導入
- **Rationale**:
  - 新規AAページ（Privy認証、AA統合）でTailwind + shadcn/ui使用
  - 既存ページ（Semaphore証明履歴等）は既存CSS維持
  - 段階的に既存ページも移行
- **Trade-offs**:
  - **Benefits**: リスク分散、段階的品質向上
  - **Compromises**: 過渡期のスタイル混在、複雑性増加
- **Follow-up**: Tailwind設定、shadcn/uiコンポーネント追加、グローバルCSS整理

### Decision: OpenZeppelin Defender完全削除

- **Context**: 環境変数に設定されているが未使用のDefender設定
- **Alternatives Considered**:
  1. 環境変数のみ削除 — 最小変更
  2. 将来の使用を想定して保持 — 不要な複雑性
- **Selected Approach**: 完全削除
- **Rationale**:
  - コードベースで実際に使用されていない
  - Biconomy AAへの完全移行により不要
  - 設定の明確化
- **Trade-offs**:
  - **Benefits**: 設定の簡素化、混乱の排除
  - **Compromises**: 将来Defenderを使用する場合は再設定が必要
- **Follow-up**: .env.example、.envからDefender関連変数削除

## Risks & Mitigations

- **スマートアカウント作成遅延（初回ログイン時3〜5秒）** — ローディングインジケーター、進捗表示、エラーリトライで軽減
- **Paymaster予算切れによるガススポンサーシップ失敗** — エラーハンドリング、ユーザーへの明確なメッセージ、Biconomy Dashboard通知設定
- **Bundlerタイムアウトまたはレート制限** — リトライロジック、エクスポネンシャルバックオフ、ユーザーフィードバック
- **ブラウザ互換性（Privyエンベデッドウォレット）** — Privy公式サポートブラウザ確認、フォールバック提供、ユーザーガイド
- **既存ユーザーの移行（Supabase Auth → Privy）** — Supabase継続使用で移行不要、新規ユーザーのみPrivy認証

## References

- [Privy Embedded Wallet Creation](https://docs.privy.io/guide/react/wallets/embedded/creation)
- [Privy React SDK Changelog](https://docs.privy.io/reference/sdk/react-auth/changelog)
- [Using Base Sub Accounts - Privy Docs](https://docs.privy.io/recipes/react/external-wallets/base-sub-accounts)
- [Account Abstraction on Base using Biconomy - Base Documentation](https://docs.base.org/learn/onchain-app-development/account-abstraction/account-abstraction-on-base-using-biconomy)
- [Biconomy Overview](https://docs.biconomy.io/smartAccountsV2/overview/)
- [Account abstraction with Biconomy | Privy Docs](https://docs.privy.io/guide/react/recipes/account-abstraction/biconomy)
- [viem - Base Documentation](https://docs.base.org/learn/onchain-app-development/frontend-setup/viem)
- [Viem · TypeScript Interface for Ethereum](https://viem.sh/)
- [Interacting with Smart Contracts on Base L2 with Viem](https://medium.com/@defiboy/interacting-with-smart-contracts-on-base-l2-with-viem-807431516d75)
- [GitHub - builders-garden/privy-smart-wallet-nextjs-starter](https://github.com/builders-garden/privy-smart-wallet-nextjs-starter) — Next.js Starter with Privy Embedded Wallet and Smart Wallet setup
