# Code Style and Conventions

## General

- Use **TypeScript** for all new code.
- Follow **Prettier** formatting rules (Tab width: 2).
- Use **ESLint** for static analysis (and **Solhint** for Solidity).
- Comments and documentation should be in **Japanese** as a primary preference.
- All files must use **2-space indentation**.

## 全体的な方針（AGENTS.mdより）

- 特段の指定がない限り、わかりやすくて自然な日本語で回答を出力
- 複雑な処理の場合は、ステップバイステップで進める
- 毎回プロジェクトをアクティベートする
- オンボーディングされていない場合はオンボーディングする

## 開発の基本理念

- **動くコードを書くだけでなく、品質・保守性・安全性を常に意識する**
- プロジェクトの段階（プロトタイプ、MVP、本番環境）に応じて適切なバランスを取る
- 問題を見つけたら放置せず、必ず対処または明示的に記録する
- **ボーイスカウトルール**: コードを見つけた時よりも良い状態で残す

## エラーハンドリングの原則

- 関連が薄く見えるエラーでも必ず解決する
- エラーの抑制（@ts-ignore、try-catchで握りつぶす等）ではなく、**根本原因を修正**
- 早期にエラーを検出し、明確なエラーメッセージを提供
- エラーケースも必ずテストでカバーする
- 外部APIやネットワーク通信は必ず失敗する可能性を考慮

## コード品質の基準

- **DRY原則**: 重複を避け、単一の信頼できる情報源を維持
- 意味のある変数名・関数名で意図を明確に伝える
- プロジェクト全体で一貫したコーディングスタイルを維持
- 小さな問題も放置せず、発見次第修正（Broken Windows理論）
- コメントは「なぜ」を説明し、「何を」はコードで表現

## テスト規律

- **テストをスキップせず、問題があれば修正する**
- 実装詳細ではなく振る舞いをテスト
- テスト間の依存を避け、任意の順序で実行可能に
- テストは高速で、常に同じ結果を返すように
- カバレッジは指標であり、質の高いテストを重視

## セキュリティの考え方

- APIキー、パスワード等は環境変数で管理（ハードコード禁止）
- すべての外部入力を検証
- 必要最小限の権限で動作（最小権限の原則）
- 不要な依存関係を避ける
- セキュリティ監査ツールを定期的に実行

## Smart Contracts

- Use **Hardhat** for development and testing.
- Contracts are located in `apps/contracts/contracts/`.
- Tests are located in `apps/contracts/test/`.
- Helper utilities in `apps/contracts/helper/` (e.g., contractJsonHelper.ts).
- Deployment outputs in `apps/contracts/outputs/` (per-network JSON files).
- Follow Solidity best practices.

## Frontend (web-app)

- Use **Next.js App Router** (files in `apps/web-app/src/app/`).
- Use Functional Components and Hooks.
- Context providers are located in `apps/web-app/src/context/`.
- Utility functions are in `apps/web-app/src/utils/`.
- Components are in `apps/web-app/src/components/`.
- **Supabase** is used for Authentication and Database.
- Semaphore Identities are stored securely in Supabase `identities` table.
- Add **JSDoc comments** to components and functions (in Japanese).

## Frontend (aa-gasless-sample)

- Use **Next.js 14 App Router** with **shadcn/ui** components.
- Authentication via **Privy** (@privy-io/react-auth).
- Smart Account implementation via **Biconomy** (@biconomy/account).
- UI components in `components/ui/` (shadcn/ui pattern).
- Providers in `providers/` directory.
- **JSDoc comments** for all components and functions (in Japanese).

## Git運用の基本

- **コンベンショナルコミット形式を使用**（feat:, fix:, docs:, test:, refactor:, chore:）
- コミットは原子的で、単一の変更に焦点を当てる
- 明確で説明的なコミットメッセージを**英語**で記述
- main/masterブランチへの直接コミットは避ける

## ドキュメントの基準

- READMEにプロジェクトの概要、セットアップ、使用方法を明確に記載
- ドキュメントをコードと同期して更新
- 実例を示すことを優先
- 重要な設計判断はADR (Architecture Decision Records)で記録
