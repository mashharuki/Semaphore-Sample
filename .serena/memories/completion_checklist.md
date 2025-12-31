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

**ビルドチェック**:
- `yarn workspace aa-gasless-sample type-check`: 型エラーがないことを確認
- `yarn workspace aa-gasless-sample build`: ビルドが成功することを確認

**実行時チェック**:
- `yarn workspace aa-gasless-sample dev`: 開発サーバーが起動することを確認

**機能テスト**:
1. **Privy認証**:
   - ログインが正常に動作すること
   - Embedded Walletが作成されること
   - ウォレットアドレスが正しく表示されること

2. **Biconomy Smart Account初期化**:
   - コンソールに以下のログが表示されること:
     - `Embedded Wallet address: 0x...`
     - `Nexus Account: 0x...`（Embedded Walletとは**異なる**アドレス）
     - `done initializing Biconomy account`
   - エラーが発生しないこと（特にAA14エラー）

3. **トランザクション送信（NFTミント等）**:
   - ガスレストランザクションが成功すること
   - Paymasterが正常にガスをスポンサーすること
   - トランザクションハッシュが返されること
   - MetaMaskの認証エラーが発生しないこと

**環境変数の確認**:

`.env.local`に以下が設定されていることを確認:
```bash
# 必須
NEXT_PUBLIC_PRIVY_APP_ID=xxx
PRIVY_APP_SECRET=xxx
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY=xxx
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=xxx

# オプション（機能に応じて）
NEXT_PUBLIC_ZKNFT_CONTRACT_ADDRESS=xxx
```

**依存関係の確認**:

以下のバージョンが正しいことを確認:
```json
{
  "@biconomy/abstractjs": "1.1.20",
  "@biconomy/account": "4.6.3",
  "@privy-io/react-auth": "3.10.0",
  "@rhinestone/module-sdk": "^0.4.0",
  "@safe-global/types-kit": "^3.0.0",
  "@metamask/delegation-toolkit": "~0.11.0"
}
```

## 3. ドキュメント

### コードコメント
- **日本語**でJSDocコメントを追加（特に複雑な関数やコンポーネント）
- 「なぜ」を説明し、「何を」はコードで表現
- Biconomy/Privy統合部分には特に詳細なコメントを付ける

### README更新
- 新機能を追加した場合、READMEを更新
- セットアップ手順が変更された場合、必ず反映
- トラブルシューティングセクションを充実させる

### その他
- `walkthrough.md`がある場合、検証の証跡を更新

## 4. 環境変数

### web-app
- Supabase環境変数がすべて`.env.local`に設定されていることを確認
- Infura API Keyやコントラクトアドレスが正しいことを確認

### aa-gasless-sample
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy App ID
- `PRIVY_APP_SECRET`: Privy App Secret
- `NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY`: Bundler API Key
- `NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY`: Paymaster API Key
- その他、機能に応じた環境変数

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
- `.env.local`が`.gitignore`に含まれているか確認

## 7. パフォーマンス（必要に応じて）

- 推測ではなく計測に基づいて最適化
- 不要なリソースの読み込みがないか確認
- Smart Account初期化は1度だけ行われているか確認

## 8. Biconomy/Privy統合の特別チェック

### コード実装の確認
- [ ] Privyのproviderを直接signerとして使用しているか
- [ ] `accountAddress`パラメータを**設定していない**か（EIP-7702を使わない場合）
- [ ] `getMEEVersion(MEEVersion.V2_1_0)`を使用しているか
- [ ] エラーハンドリングが適切に実装されているか

### よくあるエラーの確認
- [ ] AA14エラーが発生していないか
- [ ] UnauthorizedProviderErrorが発生していないか
- [ ] SMART_SESSIONS_ADDRESSのimportエラーがないか

### ログの確認
開発者コンソールで以下を確認:
- [ ] Smart Accountのアドレスが正しく表示されている
- [ ] トランザクション送信時にエラーが発生していない
- [ ] Paymasterが正常に動作している（417エラーがない）

## 9. トラブルシューティング

問題が発生した場合、以下を確認:

1. **依存関係の問題**:
   ```bash
   yarn install
   yarn workspace aa-gasless-sample build
   ```

2. **型エラー**:
   ```bash
   yarn workspace aa-gasless-sample type-check
   ```

3. **Biconomy設定**:
   - Bundler/Paymaster API Keyが正しいか
   - ネットワークがBase Sepoliaになっているか
   - Smart Accountアドレスが正しく計算されているか

4. **Privy設定**:
   - App IDとSecretが正しいか
   - Embedded Walletが有効になっているか
   - ログインフローが正常に動作しているか
