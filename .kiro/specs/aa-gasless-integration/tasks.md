# 実装タスク: AA Gasless Integration

## Phase 1: 基盤整備

- [x] 1. プロジェクト依存関係とツールチェーンのセットアップ
- [x] 1.1 (P) AA統合に必要なNPMパッケージをインストール
  - Privy認証SDK（@privy-io/react-auth）をインストール
  - Biconomy AA SDK（@biconomy/abstractjs、@biconomy/account）をインストール
  - viemライブラリをインストール
  - react-hot-toast通知ライブラリをインストール
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 1.2 (P) Tailwind CSSとshadcn/uiのセットアップ
  - Tailwind CSS、PostCSS、Autoprefixerをインストール
  - tailwind.config.js、postcss.config.jsを作成
  - globals.cssにTailwind directives追加
  - shadcn/ui初期化（components.json作成）
  - Button、Card、Input、Labelコンポーネントを追加
  - _Requirements: 6.1_

- [x] 1.3 環境変数の設定と検証
  - .env.exampleにPrivy、Biconomy環境変数を追加
  - NEXT_PUBLIC_PRIVY_APP_ID、NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY、NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEYのプレースホルダー追加
  - 環境変数バリデーション関数を実装（起動時チェック）
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 1.4 (P) PrivyProviderの作成と統合
  - src/providers/privy-providers.tsxを作成
  - Privy設定（loginMethods、embeddedWallets、supportedChains）を実装
  - Base Sepolia（chain ID 84532）をサポートチェーンに追加
  - app/layout.tsxでPrivyProviderをルートにラップ
  - _Requirements: 1.1_

- [x] 1.5 (P) ToasterProviderの作成と統合
  - src/providers/toaster-provider.tsxを作成
  - react-hot-toastのToasterコンポーネントを設定
  - app/layout.tsxでToasterProviderを追加
  - _Requirements: 6.3_

## Phase 2: 認証移行

- [x] 2. Privy認証への完全移行
- [x] 2.1 AuthContextのPrivy対応実装
  - src/context/AuthContext.tsxを開き、Supabase Auth依存を削除
  - usePrivyフックから認証状態（user、ready、authenticated、login、logout）を取得
  - AuthContextTypeインターフェースをPrivy対応に更新
  - エラーハンドリング（認証失敗、リトライロジック）を実装
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 2.2 アイデンティティ管理ページのPrivy統合
  - src/app/page.tsxを開き、Supabase Authコンポーネントを削除
  - Privyのlogin、logout関数を使用
  - Privy user.idをuseSemaphoreIdentityに渡してアイデンティティ取得
  - ログイン・ログアウトボタンのUI更新
  - ローディング状態（Privy.ready）のハンドリング
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 2.3 useSemaphoreIdentityのPrivy連携対応
  - src/hooks/useSemaphoreIdentity.tsを開く
  - Supabase Auth user.idをPrivy user.idに置き換え
  - Supabaseクエリのuser_idマッピングをPrivy user.idに変更
  - アイデンティティ保存・復元ロジックのエラーハンドリング強化
  - _Requirements: 1.2, 1.3_

## Phase 3: Account Abstraction統合

- [ ] 3. Biconomy AAによるガスレストランザクション実装
- [x] 3.1 useBiconomyフックの作成
  - src/hooks/useBiconomy.tsを作成
  - initializeBiconomyAccount関数を実装（toNexusAccount、createSmartAccountClient）
  - スマートアカウント作成のローディング・エラー状態管理
  - sendTransaction関数を実装（encodeFunctionData、Paymaster検証、UserOperation送信）
  - Paymasterエラー、Bundlerタイムアウトのエラーハンドリング
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.1, 7.2_

- [x] 3.2 グループ参加機能のAA化
  - src/app/group/page.tsxを開く
  - /api/join API呼び出しを削除
  - useBiconomyフックを使用してスマートアカウント初期化
  - joinGroupトランザクションをBiconomy経由で送信（sendTransaction）
  - ローディングスピナー、成功/失敗トースト通知を実装
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 7.3_

- [x] 3.3 フィードバック送信機能のAA化
  - フィードバック送信ページ（該当ページ特定）を開く
  - /api/feedback API呼び出しを削除
  - useBiconomyフックを使用してsendFeedbackトランザクション送信
  - Semaphore証明パラメータ（merkleTreeDepth、merkleTreeRoot、nullifier、feedback、points）をエンコード
  - エラーハンドリング（Paymaster失敗、Invalid Proof等）を実装
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.3, 7.1, 7.2, 7.4_

- [ ] 3.4 SemaphoreContextのviem移行
  - src/context/SemaphoreContext.tsxを開く
  - ethers.jsのSemaphoreEthersをviemのpublicClient + getLogsに置き換え
  - refreshUsers関数をviem対応に書き換え
  - refreshFeedback関数をviem対応に書き換え
  - コントラクトABIのimportパス確認（Feedback.json）
  - _Requirements: 4.4_

- [ ] 3.5 サーバーサイドAPIの削除
  - src/app/api/join/route.tsを削除
  - src/app/api/feedback/route.tsを削除
  - PRIVATE_KEY環境変数への参照をすべて削除
  - _Requirements: 5.3, 5.5_

## Phase 4: クリーンアップと仕上げ

- [ ] 4. 最終調整とドキュメント整備
- [ ] 4.1 (P) 未使用設定の削除
  - .env.exampleからNEXT_PUBLIC_OPENZEPPELIN_AUTOTASK_WEBHOOK削除
  - .env.exampleからNEXT_PUBLIC_GELATO_RELAYER_ENDPOINT、NEXT_PUBLIC_GELATO_RELAYER_CHAIN_ID削除
  - .envから同様の環境変数を削除
  - PRIVATE_KEY環境変数削除
  - Supabase Auth依存の完全削除確認
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 4.2 (P) UIコンポーネントの最終調整
  - shadcn/uiコンポーネント（Button、Card）を既存ページに適用
  - ローディングスピナーコンポーネントを作成・統合
  - ダークテーマ、グラスモーフィズム効果をCSSに追加
  - レスポンシブデザイン確認（モバイルデバイス対応）
  - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6_

- [ ] 4.3 ドキュメントと外部サービス設定ガイド
  - README.mdのセットアップセクションを更新
  - Privy Console設定手順を追加（App ID取得、ログイン方法、エンベデッドウォレット）
  - Biconomy Dashboard設定手順を追加（Paymaster作成、Gas Tank、ポリシー設定、Bundler）
  - 環境変数一覧セクションを更新
  - aa-gasless-sampleとの主要な違いをドキュメント化
  - _Requirements: 8.3, 8.4, 8.5_

- [ ] 4.4 E2E統合テストとフロー検証
  - Privyログインフロー動作確認（メール、ウォレット、Google）
  - アイデンティティ作成・保存・復元フロー確認
  - スマートアカウント作成フロー確認
  - グループ参加トランザクション送信確認（Base Sepolia）
  - フィードバック送信トランザクション確認
  - エラーハンドリング確認（Paymaster失敗シミュレーション、ネットワークエラー）
  - _Requirements: 8.1, 8.2_

- [ ]* 4.5 単体テスト・統合テストの実装（オプショナル）
  - useBiconomy.initializeBiconomyAccount単体テスト（モック: Privy、Biconomy SDK）
  - useBiconomy.sendTransaction単体テスト（モック: Paymaster、Bundler）
  - AuthContext単体テスト（モック: usePrivy）
  - useSemaphoreIdentity統合テスト（モック: Supabase）
  - SemaphoreContext.refreshUsers統合テスト（モック: viem publicClient）
  - _Requirements: 8.1, 8.2（テストカバレッジ向上のため、MVP後に実施可能）_
