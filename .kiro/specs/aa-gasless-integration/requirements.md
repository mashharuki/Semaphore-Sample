# Requirements Document

## Project Description (Input)
web-appでは現在ガスレスにするためにOpenZeppelin Defenderを使っていますが、この実装ではなく Privy + Biconomyを利用した最高のUI/UXに昇華させたいと考えています(AAを利用してガスレスでトランザクションを送るようにしたい)。実装方法やコンポーネントの構造については、aa-gasless-sampleを参考にしてください。既存のソースをベースにしてガスレス＋AAで動くようにしてください。contracts-baseSepolia.jsonにBaseSepoliaにデプロイしFeedbackコントラクトが格納してあります！ その実装計画を立ててください！！よろしくお願いします！

## Introduction

本仕様は、Semaphore-Sample プロジェクトの web-app において、現行の OpenZeppelin Defender によるガスレス実装を Privy + Biconomy のアカウント抽象化（AA）スタックに移行することを目的とする。aa-gasless-sample の実装パターンを参考にしつつ、既存の Feedback コントラクト（Base Sepolia デプロイ済み）との統合を維持し、ユーザー体験を最高水準に引き上げる。

---

## Requirements

### Requirement 1: Privy認証統合
**目的**: ユーザーとして、Web2ライクな認証体験でウォレットにアクセスしたい。これにより、秘密鍵管理の負担なく安全にアプリケーションを利用できる。

#### Acceptance Criteria
1. When ユーザーがアプリケーションにアクセスする, the Web App shall Privy認証プロバイダーを初期化する
2. When ユーザーが「ログイン」ボタンをクリックする, the Web App shall Privyのログインモーダルを表示する
3. When ユーザーがPrivy経由でログインに成功する, the Web App shall 埋め込みウォレットアドレスを取得して表示する
4. When ユーザーがログアウトを選択する, the Web App shall Privyセッションを終了しウォレット情報をクリアする
5. If Privy認証に失敗する, then the Web App shall エラーメッセージを表示しリトライオプションを提供する

---

### Requirement 2: Biconomyスマートアカウント作成
**目的**: ユーザーとして、初回ログイン時に自動的にスマートアカウントを作成したい。これにより、AA機能をシームレスに利用できる。

#### Acceptance Criteria
1. When ユーザーがPrivy認証を完了する, the Web App shall BiconomyのスマートアカウントSDKを初期化する
2. When スマートアカウントが未作成である, the Web App shall Base Sepolia上で新しいスマートアカウントを作成する
3. When スマートアカウント作成が完了する, the Web App shall スマートアカウントアドレスを永続化し画面に表示する
4. If スマートアカウント作成に失敗する, then the Web App shall 詳細なエラー情報をログに記録しユーザーにリトライを促す
5. The Web App shall スマートアカウント作成プロセス中にローディングインジケーターを表示する

---

### Requirement 3: ガスレストランザクション送信
**目的**: ユーザーとして、ガス代を支払うことなくFeedbackコントラクトにトランザクションを送信したい。これにより、ETHを保有していなくてもアプリケーションを利用できる。

#### Acceptance Criteria
1. When ユーザーがフィードバック送信アクションを実行する, the Web App shall Biconomy Paymaster経由でユーザー操作(UserOperation)を構築する
2. When UserOperationが構築される, the Web App shall Paymasterによるガススポンサーシップを検証する
3. When UserOperationを送信する, the Web App shall Base Sepolia上のBundlerにトランザクションを送信する
4. When UserOperationが正常に処理される, the Web App shall トランザクションハッシュを取得し成功メッセージを表示する
5. If Paymaster検証に失敗する, then the Web App shall ガススポンサーシップエラーを明示的に通知する
6. If UserOperation送信に失敗する, then the Web App shall エラー詳細をログに記録しユーザーにリトライオプションを提供する

---

### Requirement 4: Feedbackコントラクト統合
**目的**: 開発者として、既存のFeedbackコントラクト（Base Sepolia）とAA統合を互換性を保ちながら接続したい。これにより、コントラクト再デプロイなしに機能を実現できる。

#### Acceptance Criteria
1. When Web Appが初期化される, the Web App shall contracts-baseSepolia.jsonからFeedbackコントラクトのアドレスとABIを読み込む
2. When スマートアカウント経由でコントラクトを呼び出す, the Web App shall ethers.jsまたはviemを使用してFeedbackコントラクトのメソッドをエンコードする
3. When Semaphore証明を含むトランザクションを送信する, the Web App shall Feedbackコントラクトの `sendFeedback` メソッドに正しいパラメータ（proof、merkleTreeDepth、merkleTreeRoot、nullifier、feedback）を渡す
4. The Web App shall 既存のSemaphoreContextとの互換性を維持する
5. If コントラクトアドレスまたはABIが見つからない, then the Web App shall 設定エラーを明示的に通知しアプリケーション起動を中止する

---

### Requirement 5: OpenZeppelin Defender移行
**目的**: 開発者として、OpenZeppelin Defenderに依存するコードを完全に削除したい。これにより、Biconomy AAスタックに統一し保守性を向上させる。

#### Acceptance Criteria
1. When 移行が完了する, the Web App shall OpenZeppelin Defender関連のライブラリ（@openzeppelin/defender-sdk等）を依存関係から削除する
2. When 移行が完了する, the Web App shall Defender関連の環境変数（API Key等）を削除する
3. When 移行が完了する, the Web App shall Defender経由のトランザクション送信コードをすべてBiconomy AA実装に置き換える
4. The Web App shall Defender Relayer設定ファイルが存在する場合は削除する
5. The Web App shall 移行前の機能（ガスレスフィードバック送信）と同等の動作を保証する

---

### Requirement 6: UI/UX改善
**目的**: ユーザーとして、aa-gasless-sampleのような洗練されたUIでアプリケーションを利用したい。これにより、現代的で直感的な操作体験を得られる。

#### Acceptance Criteria
1. When ユーザーがアプリケーションを使用する, the Web App shall Tailwind CSSとshadcn/uiコンポーネントを使用したUIを提供する
2. When トランザクションが処理中である, the Web App shall 視覚的なローディングインジケーターとステータスメッセージを表示する
3. When トランザクションが成功または失敗する, the Web App shall トースト通知またはモーダルで結果を明確に通知する
4. Where ウォレット接続が必要である, the Web App shall 接続状態を視覚的に示す（アドレス表示、切断ボタン等）
5. The Web App shall レスポンシブデザインでモバイルデバイスでも適切に表示される
6. The Web App shall aa-gasless-sampleのレイアウトパターン（PageContainer、Stepper等）を参考にした構造を採用する

---

### Requirement 7: エラーハンドリングとロギング
**目的**: 開発者として、AA統合に関連するエラーを適切に捕捉し診断できるようにしたい。これにより、問題の迅速な特定と解決が可能になる。

#### Acceptance Criteria
1. When 任意のAA関連操作でエラーが発生する, the Web App shall エラーメッセージ、スタックトレース、コンテキスト情報をコンソールに出力する
2. When Paymaster、Bundler、またはスマートアカウント操作が失敗する, the Web App shall 失敗の原因を特定可能な詳細情報をログに記録する
3. If ネットワーク接続エラーが発生する, then the Web App shall ユーザーにネットワーク状態の確認を促すメッセージを表示する
4. If Biconomy APIキーが無効または期限切れである, then the Web App shall 設定エラーとして明示的に通知する
5. The Web App shall 本番環境では機密情報（秘密鍵、APIキー等）をログに出力しない

---

### Requirement 8: テストとドキュメント
**目的**: 開発者として、AA統合の動作を検証し、将来のメンテナンスを容易にしたい。これにより、品質と保守性を確保できる。

#### Acceptance Criteria
1. When AA統合実装が完了する, the Development Team shall Privy認証フローの動作を手動テストで検証する
2. When AA統合実装が完了する, the Development Team shall Biconomyスマートアカウント作成とトランザクション送信の動作を手動テストで検証する
3. When AA統合実装が完了する, the Development Team shall README.mdにセットアップ手順（環境変数、依存関係インストール、起動方法）を記載する
4. When AA統合実装が完了する, the Development Team shall aa-gasless-sampleとの主要な違いをドキュメント化する
5. The Development Team shall Biconomy Dashboard、Privy Console等の外部サービス設定手順をドキュメント化する

---

### Requirement 9: 環境変数と設定管理
**目的**: 開発者として、AA統合に必要な設定を環境変数で管理したい。これにより、異なる環境（開発、本番）での切り替えを容易にする。

#### Acceptance Criteria
1. The Web App shall Privy App IDを環境変数 `NEXT_PUBLIC_PRIVY_APP_ID` から読み込む
2. The Web App shall Biconomy Paymaster URLを環境変数 `NEXT_PUBLIC_BICONOMY_PAYMASTER_URL` から読み込む
3. The Web App shall Biconomy Bundler URLを環境変数 `NEXT_PUBLIC_BICONOMY_BUNDLER_URL` から読み込む
4. The Web App shall ターゲットネットワーク（Base Sepolia）のチェーンIDとRPC URLを環境変数から読み込む
5. If 必須の環境変数が設定されていない, then the Web App shall アプリケーション起動時に明確なエラーメッセージを表示する
6. The Development Team shall .env.exampleファイルに全ての必須環境変数のサンプルを記載する

---
