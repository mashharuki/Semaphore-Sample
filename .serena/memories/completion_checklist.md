# Completion Checklist

タスク完了時には、以下のステップを実行してください：

## 1. コード品質チェック

### Linting
- `yarn lint`: すべてのパッケージでlintingエラーがないことを確認
- エラーがある場合は**抑制せず根本原因を修正**（@ts-ignoreは禁止）

### Formatting
- `yarn prettier:write`: 一貫したコードスタイルを適用
- すべてのファイルが2スペースインデントであることを確認

## 2. テスト

### Contractsの変更がある場合
- `yarn workspace monorepo-ethers-contracts hardhat test`: すべてのコントラクトテストが通ることを確認
- **テストをスキップしない**。問題があれば修正する

### web-appの変更がある場合
- アプリが起動し、期待通りに動作することを確認
- Semaphore identityの復元がSupabase DBから正常に行われることを確認
- 環境変数が正しく設定されていることを確認（`.env.local`）

### aa-gasless-sampleの変更がある場合
- `yarn workspace aa-gasless-sample type-check`: 型エラーがないことを確認
- `yarn workspace aa-gasless-sample build`: ビルドが成功することを確認
- Privy認証が正常に動作することを確認
- Biconomy Smart Accountが正しく初期化されることを確認
- `.env.local`に必要な環境変数（PRIVY_APP_ID等）が設定されていることを確認

## 3. ドキュメント

### コードコメント
- **日本語**でJSDocコメントを追加（特に複雑な関数やコンポーネント）
- 「なぜ」を説明し、「何を」はコードで表現

### README更新
- 新機能を追加した場合、READMEを更新
- セットアップ手順が変更された場合、必ず反映

### その他
- `walkthrough.md`がある場合、検証の証跡を更新

## 4. 環境変数

### web-app
- Supabase環境変数がすべて`.env.local`に設定されていることを確認
- Infura API Keyやコントラクトアドレスが正しいことを確認

### aa-gasless-sample
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy App ID
- `PRIVY_APP_SECRET`: Privy App Secret
- その他Biconomy関連の設定

## 5. Git

### コミット前
- コンベンショナルコミット形式を使用（feat:, fix:, docs:, test:, refactor:, chore:）
- **英語**で明確で説明的なコミットメッセージを記述
- コミットは原子的で、単一の変更に焦点を当てる

### コミット後
- main/masterブランチへの直接コミットは避け、ブランチを使用
- PRを作成する場合、変更内容と理由を明確に説明

## 6. セキュリティチェック

- APIキーやパスワードが環境変数で管理されているか確認（ハードコード禁止）
- 外部入力の検証が適切に行われているか確認
- 不要な依存関係が追加されていないか確認

## 7. パフォーマンス（必要に応じて）

- 推測ではなく計測に基づいて最適化
- 不要なリソースの読み込みがないか確認
