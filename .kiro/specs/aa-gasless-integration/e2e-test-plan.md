# E2E統合テスト計画書: AA Gasless Integration

## 概要

このドキュメントは、AA Gasless Integration機能のEnd-to-End（E2E）統合テストの手順を定義します。各テストケースは、実際のPrivy、Biconomy、Base Sepoliaテストネットに接続して実行されます。

## テスト環境のセットアップ

### 前提条件

以下の環境変数が正しく設定されていることを確認してください:

```bash
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=<your_privy_app_id>

# Biconomy
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY=<your_bundler_api_key>
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=<your_paymaster_api_key>

# Base Sepolia
NEXT_PUBLIC_DEFAULT_NETWORK=baseSepolia
NEXT_PUBLIC_INFURA_API_KEY=<your_infura_api_key>

# Contracts
NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS=0x521a4A2D9A6542A1a578ecF362B8CBeE4Ef46e02
NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS=0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f
NEXT_PUBLIC_GROUP_ID=0

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

### 外部サービス確認

1. **Privy Console**
   - アプリケーションが作成されていること
   - Base Sepolia (84532) がサポートチェーンに追加されていること
   - エンベデッドウォレットが有効化されていること

2. **Biconomy Dashboard**
   - Paymaster（Base Sepolia）が作成されていること
   - Gas Tankに十分なBase Sepolia ETHがあること（推奨: 0.01 ETH以上）
   - Feedbackコントラクト（0x521a4A2D9A6542A1a578ecF362B8CBeE4Ef46e02）がホワイトリストに登録されていること
   - `joinGroup`と`sendFeedback`メソッドが許可されていること

3. **Supabase**
   - `identities`テーブルが存在すること
   - テーブルスキーマが正しいこと:
     ```sql
     user_id TEXT PRIMARY KEY
     private_key TEXT NOT NULL
     commitment TEXT NOT NULL
     updated_at TIMESTAMP NOT NULL
     ```

### アプリケーション起動

```bash
cd apps/web-app
pnpm install
pnpm dev
```

ブラウザで http://localhost:3000 にアクセス

---

## テストケース一覧

| ID | テストケース名 | 優先度 | 期待所要時間 |
|----|---------------|--------|-------------|
| TC-001 | Privyログインフロー（メール認証） | P0 | 2分 |
| TC-002 | Privyログインフロー（ウォレット接続） | P1 | 2分 |
| TC-003 | Privyログインフロー（Google認証） | P1 | 2分 |
| TC-004 | アイデンティティ作成・保存 | P0 | 3分 |
| TC-005 | アイデンティティ復元 | P0 | 2分 |
| TC-006 | スマートアカウント作成 | P0 | 1分 |
| TC-007 | グループ参加トランザクション送信 | P0 | 2分 |
| TC-008 | フィードバック送信トランザクション | P0 | 3分 |
| TC-009 | Paymaster失敗エラーハンドリング | P1 | 2分 |
| TC-010 | ネットワークエラーハンドリング | P2 | 2分 |

---

## 詳細テストケース

### TC-001: Privyログインフロー（メール認証）

#### 目的
Privyのメール認証を使用してログインし、エンベデッドウォレットが自動作成されることを確認する。

#### Given（前提条件）
- アプリケーションが起動していること
- ブラウザのローカルストレージがクリアされていること（初回ログイン状態）
- テスト用メールアドレスが準備されていること

#### When（実行手順）
1. http://localhost:3000 にアクセス
2. 「Login with Privy」ボタンをクリック
3. Privyモーダルで「Email」を選択
4. テスト用メールアドレスを入力
5. メールボックスで認証コードを確認
6. 認証コードを入力

#### Then（期待結果）
- ✅ Privyモーダルが閉じる
- ✅ ページ上部にログアウトボタンが表示される
- ✅ ユーザー情報（user.id）がAuthContextに設定される
- ✅ コンソールに「Welcome back! Your Semaphore identity has been...」または「Identity not found...」メッセージが表示される

#### チェックポイント
- [ ] Privyログイン成功
- [ ] エンベデッドウォレットが自動作成されていること（Privy Dashboardで確認）
- [ ] ログアウトボタンが表示されること
- [ ] コンソールエラーがないこと

#### トラブルシューティング
- **エラー: "Privy app ID is not set"** → 環境変数 `NEXT_PUBLIC_PRIVY_APP_ID` を確認
- **エラー: "Failed to fetch authentication code"** → Privy Consoleでメール認証が有効化されているか確認
- **認証コードが届かない** → スパムフォルダを確認、または別のメールアドレスで再試行

---

### TC-002: Privyログインフロー（ウォレット接続）

#### 目的
外部ウォレット（MetaMask等）を接続してPrivyログインできることを確認する。

#### Given（前提条件）
- MetaMaskまたは他のウォレットがブラウザにインストールされていること
- ウォレットがBase Sepoliaネットワークに接続されていること
- アプリケーションが起動していること

#### When（実行手順）
1. http://localhost:3000 にアクセス
2. 「Login with Privy」ボタンをクリック
3. Privyモーダルで「Wallet」を選択
4. MetaMaskを選択
5. MetaMaskで接続を承認
6. 必要に応じて署名リクエストを承認

#### Then（期待結果）
- ✅ Privyモーダルが閉じる
- ✅ ログアウトボタンが表示される
- ✅ ウォレットアドレスがPrivy user.wallet.addressに設定される

#### チェックポイント
- [ ] ウォレット接続成功
- [ ] ログイン後にウォレットアドレスが確認できること
- [ ] コンソールエラーがないこと

---

### TC-003: Privyログインフロー（Google認証）

#### 目的
GoogleアカウントでPrivyログインできることを確認する。

#### Given（前提条件）
- Googleアカウントが準備されていること
- アプリケーションが起動していること

#### When（実行手順）
1. http://localhost:3000 にアクセス
2. 「Login with Privy」ボタンをクリック
3. Privyモーダルで「Google」を選択
4. Googleアカウントを選択
5. 必要に応じて権限を承認

#### Then（期待結果）
- ✅ Privyモーダルが閉じる
- ✅ ログアウトボタンが表示される
- ✅ Googleアカウント情報がPrivy userに設定される

#### チェックポイント
- [ ] Google認証成功
- [ ] ログイン後にユーザー情報が確認できること
- [ ] コンソールエラーがないこと

---

### TC-004: アイデンティティ作成・保存

#### 目的
Semaphore Identityを作成し、Supabaseに正しく保存されることを確認する。

#### Given（前提条件）
- Privyでログイン済み（TC-001完了）
- Supabaseデータベースに接続可能
- `identities`テーブルが存在すること

#### When（実行手順）
1. ルートページ（/）にアクセス
2. 「Create Identity」ボタンをクリック
3. ローディングスピナーが表示されるのを確認
4. アイデンティティが作成されるまで待機

#### Then（期待結果）
- ✅ ローディングスピナーが消える
- ✅ Identity情報が画面に表示される:
  - Private Key (base64)
  - Public Key [BigInt, BigInt]
  - Commitment (BigInt)
- ✅ コンソールに「Your new Semaphore identity has been saved to Supabase 🚀」と表示される
- ✅ Supabaseの`identities`テーブルに新しいレコードが挿入される

#### チェックポイント
- [ ] アイデンティティ作成成功
- [ ] 画面にPrivate Key、Public Key、Commitmentが表示されること
- [ ] Supabaseにレコードが保存されていること（Supabase Dashboardで確認）
- [ ] `user_id`がPrivy user.idと一致すること
- [ ] コンソールエラーがないこと

#### データ検証（Supabase Dashboard）
```sql
SELECT * FROM identities WHERE user_id = '<privy_user_id>';
```
- `private_key`: base64文字列
- `commitment`: 数値文字列
- `updated_at`: タイムスタンプ

---

### TC-005: アイデンティティ復元

#### 目的
既存のアイデンティティがSupabaseから正しく復元されることを確認する。

#### Given（前提条件）
- TC-004でアイデンティティが作成済み
- Privyログイン済み

#### When（実行手順）
1. ページをリロード（F5またはCmd+R）
2. ローディング状態が表示されるのを確認
3. アイデンティティがロードされるまで待機

#### Then（期待結果）
- ✅ ローディングスピナーが消える
- ✅ 以前作成したアイデンティティ情報が表示される
- ✅ コンソールに「Welcome back! Your Semaphore identity has been securely loaded from Supabase 🔐」と表示される
- ✅ Commitmentが前回と同じ値であること

#### チェックポイント
- [ ] アイデンティティ復元成功
- [ ] 表示されるCommitmentが前回と一致すること
- [ ] コンソールエラーがないこと

---

### TC-006: スマートアカウント作成

#### 目的
Biconomyスマートアカウントが正しく作成されることを確認する。

#### Given（前提条件）
- TC-004でアイデンティティが作成済み
- Privyログイン済み
- Biconomy PaymasterにBase Sepolia ETHがチャージされていること

#### When（実行手順）
1. `/group` ページに移動
2. 「Join group」ボタンをクリック
3. トースト通知「Initializing smart account...」が表示されるのを確認
4. スマートアカウント作成完了まで待機（約5秒）

#### Then（期待結果）
- ✅ トースト通知が「Sending transaction...」に変わる
- ✅ コンソールに「Smart Account Address:」とアドレスが出力される
- ✅ スマートアカウントアドレスが有効なEthereumアドレス形式（0x...）であること

#### チェックポイント
- [ ] スマートアカウント作成成功
- [ ] コンソールにスマートアカウントアドレスが表示されること
- [ ] アドレスが0x形式であること
- [ ] コンソールエラーがないこと

---

### TC-007: グループ参加トランザクション送信

#### 目的
Biconomy経由でガスレスにグループ参加トランザクションを送信できることを確認する。

#### Given（前提条件）
- TC-006でスマートアカウントが作成済み
- Biconomy PaymasterにBase Sepolia ETHがチャージされていること
- Feedbackコントラクトがホワイトリストに登録されていること
- `joinGroup`メソッドが許可されていること

#### When（実行手順）
1. `/group` ページに移動
2. 「Join group」ボタンをクリック
3. トランザクション送信完了まで待機（約10〜30秒）

#### Then（期待結果）
- ✅ トースト通知が「Initializing smart account...」→「Sending transaction...」→「Successfully joined the group!」と遷移する
- ✅ コンソールに「You have joined the Feedback group! 🎉 Transaction: 0x...」とトランザクションハッシュが表示される
- ✅ グループユーザーリストに自分のCommitmentが追加される（太字で表示）
- ✅ 「Join group」ボタンが無効化される

#### チェックポイント
- [ ] トランザクション送信成功
- [ ] トランザクションハッシュが表示されること
- [ ] グループユーザーリストに自分のCommitmentが表示されること
- [ ] Base Sepolia Explorer（https://sepolia.basescan.org/）でトランザクションが確認できること
- [ ] ガス代が0 ETHであること（Paymasterがスポンサー）
- [ ] コンソールエラーがないこと

#### データ検証（Base Sepolia Explorer）
1. トランザクションハッシュをコピー
2. https://sepolia.basescan.org/tx/<tx_hash> にアクセス
3. "To" フィールドがFeedbackコントラクトアドレス（0x521a4A2D9A6542A1a578ecF362B8CBeE4Ef46e02）であること
4. "Input Data"に`joinGroup`メソッドシグネチャが含まれていること

---

### TC-008: フィードバック送信トランザクション

#### 目的
ZK証明を生成し、Biconomy経由でフィードバック送信トランザクションを送信できることを確認する。

#### Given（前提条件）
- TC-007でグループ参加済み
- Semaphoreアイデンティティが作成済み

#### When（実行手順）
1. `/proofs` ページに移動
2. フィードバックテキストを入力（例: "Test feedback from AA integration"）
3. 「Send Feedback」ボタンをクリック
4. ZK証明生成完了まで待機（約5〜10秒）
5. トランザクション送信完了まで待機（約10〜30秒）

#### Then（期待結果）
- ✅ トースト通知が「Generating proof...」→「Sending transaction...」→「Feedback sent successfully!」と遷移する
- ✅ コンソールに「Feedback sent! Transaction: 0x...」とトランザクションハッシュが表示される
- ✅ フィードバックリストに送信したフィードバックが追加される

#### チェックポイント
- [ ] ZK証明生成成功
- [ ] トランザクション送信成功
- [ ] トランザクションハッシュが表示されること
- [ ] フィードバックリストに新しいフィードバックが表示されること
- [ ] Base Sepolia Explorerでトランザクションが確認できること
- [ ] コンソールエラーがないこと

#### データ検証（Base Sepolia Explorer）
1. トランザクションハッシュをコピー
2. https://sepolia.basescan.org/tx/<tx_hash> にアクセス
3. "Input Data"に`sendFeedback`メソッドシグネチャが含まれていること
4. ガス代が0 ETHであること（Paymasterがスポンサー）

---

### TC-009: Paymaster失敗エラーハンドリング

#### 目的
Paymaster予算切れ時に適切なエラーハンドリングが行われることを確認する。

#### Given（前提条件）
- Biconomy PaymasterのGas Tankが空または残高不足の状態
- Privyログイン済み
- アイデンティティ作成済み

#### When（実行手順）
1. `/group` ページに移動
2. 「Join group」ボタンをクリック
3. Paymasterエラーが発生するまで待機

#### Then（期待結果）
- ✅ トースト通知がエラーメッセージに変わる（例: "Failed to join group: Paymaster verification failed"）
- ✅ コンソールに詳細なエラーログが出力される
- ✅ ユーザーに再試行を促すメッセージが表示される
- ✅ アプリケーションがクラッシュしないこと

#### チェックポイント
- [ ] エラーメッセージが表示されること
- [ ] ユーザーフレンドリーなエラー文言であること
- [ ] コンソールに詳細なエラー情報が出力されること
- [ ] アプリケーションが正常に動作し続けること

#### リカバリー手順
Biconomy DashboardでGas TankにBase Sepolia ETHを追加してから再試行

---

### TC-010: ネットワークエラーハンドリング

#### 目的
ネットワーク接続エラー時に適切なエラーハンドリングが行われることを確認する。

#### Given（前提条件）
- Privyログイン済み
- アイデンティティ作成済み

#### When（実行手順）
1. ブラウザのDevToolsを開く
2. Network タブで "Offline" モードを有効化
3. `/group` ページで「Refresh」ボタンをクリック
4. エラーが発生するまで待機

#### Then（期待結果）
- ✅ ユーザーにネットワークエラーメッセージが表示される
- ✅ コンソールに「Network error」または「Failed to fetch」エラーが出力される
- ✅ アプリケーションがクラッシュしないこと
- ✅ オフラインモードを解除後、正常に動作すること

#### チェックポイント
- [ ] エラーメッセージが表示されること
- [ ] アプリケーションが正常に動作し続けること
- [ ] ネットワーク復旧後に機能が正常に動作すること

---

## テスト実行記録

### テスト実行日時
日時: YYYY-MM-DD HH:MM

### テスト環境
- ブラウザ: 
- OS: 
- Node.js バージョン: 
- Next.js バージョン: 

### テスト結果サマリー

| テストケースID | 結果 | 実行時間 | 備考 |
|---------------|------|---------|------|
| TC-001 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-002 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-003 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-004 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-005 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-006 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-007 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-008 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-009 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |
| TC-010 | ⬜️ Pass / ❌ Fail / ⏸️ Skipped |  |  |

### 発見された問題

| 問題ID | テストケースID | 深刻度 | 問題概要 | 再現手順 | 対応状況 |
|-------|---------------|--------|---------|---------|---------|
|  |  |  |  |  |  |

### 総合評価

- **合格条件**: P0テストケース（TC-001, TC-004, TC-005, TC-006, TC-007, TC-008）がすべてPassであること
- **結果**: ⬜️ 合格 / ❌ 不合格
- **コメント**: 

---

## トラブルシューティングガイド

### 一般的な問題

#### 問題: "Privy app ID is not set"
**原因**: 環境変数 `NEXT_PUBLIC_PRIVY_APP_ID` が設定されていない
**解決策**:
1. `.env` ファイルを確認
2. Privy Console から App ID を取得
3. `.env` に `NEXT_PUBLIC_PRIVY_APP_ID=<your_app_id>` を追加
4. アプリケーションを再起動

#### 問題: "Paymaster verification failed"
**原因**: Biconomy Paymaster の Gas Tank が空、またはコントラクトがホワイトリストに登録されていない
**解決策**:
1. Biconomy Dashboard → Paymasters → 該当Paymaster → Gas Tank を確認
2. 残高が不足している場合、Base Sepolia ETH を追加
3. Policies → Contract Whitelisting で Feedback コントラクトが登録されているか確認
4. `joinGroup` と `sendFeedback` メソッドが許可されているか確認

#### 問題: "Network error" または "Failed to fetch"
**原因**: RPC エンドポイントが応答していない、またはレート制限
**解決策**:
1. Infura ダッシュボードでアクセス状況を確認
2. 環境変数 `NEXT_PUBLIC_INFURA_API_KEY` が正しいか確認
3. 別の RPC プロバイダー（Alchemy 等）を試す
4. ブラウザのネットワーク接続を確認

#### 問題: "Identity not found for this account"
**原因**: Supabase にアイデンティティが保存されていない
**解決策**:
1. Supabase Dashboard → Table Editor → identities テーブルを確認
2. `user_id` が Privy user.id と一致しているか確認
3. Row Level Security (RLS) ポリシーが正しく設定されているか確認
4. 「Create Identity」ボタンで新しいアイデンティティを作成

#### 問題: "Invalid proof" または "Proof verification failed"
**原因**: ZK 証明が無効、またはメルクルツリールートが不一致
**解決策**:
1. グループに正しく参加しているか確認（TC-007 を実行）
2. SemaphoreContext が最新のグループメンバーリストを取得しているか確認
3. 「Refresh」ボタンでグループデータを再取得
4. アイデンティティが正しく復元されているか確認

---

## 付録

### 参考リンク

- [Privy Documentation](https://docs.privy.io/)
- [Biconomy Documentation](https://docs.biconomy.io/)
- [Semaphore Protocol Documentation](https://docs.semaphore.pse.dev/)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Base Sepolia Faucet](https://faucet.quicknode.com/base/sepolia)

### テストデータ

#### サンプルフィードバックメッセージ
- "This is a test feedback from AA integration"
- "Semaphore + Biconomy works great!"
- "Anonymous feedback test 123"

#### 環境変数テンプレート
```bash
# .env.test.example
NEXT_PUBLIC_PRIVY_APP_ID=test_app_id
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY=test_bundler_key
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=test_paymaster_key
NEXT_PUBLIC_DEFAULT_NETWORK=baseSepolia
NEXT_PUBLIC_INFURA_API_KEY=test_infura_key
NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS=0x521a4A2D9A6542A1a578ecF362B8CBeE4Ef46e02
NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS=0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f
NEXT_PUBLIC_GROUP_ID=0
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
