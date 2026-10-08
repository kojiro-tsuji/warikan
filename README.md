# WARIKAN

グループで立て替えた支出を記録し、誰が誰にいくら払えばよいかを自動で計算する割り勘アプリです。

本番環境: https://warikan-gold.vercel.app

## 特徴

- **ログイン不要**：グループを作成すると URL が発行され、それを共有するだけでメンバー全員が同じデータを閲覧・追加できます
- **送金回数の少ない精算**：誰が誰にいくら払えばよいかを、なるべく少ない送金回数で提示します
- **1円のズレが出ない計算**：支出ごとに1円単位で割り、割り切れない端数はメンバー順に1円ずつ負担します
- **手帳風のデザイン**：方眼紙の背景やマスキングテープ風の見出しを使った、あたたかみのある見た目。ダークモードにも対応しています

## 画面と機能

| 画面 | パス | できること |
| --- | --- | --- |
| トップ | `/` | グループ名とメンバー（2人以上）を入力してグループを作成 |
| グループ | `/groups/[groupId]` | 合計金額・メンバー数・支出件数の確認、URL のコピー、精算結果（払う人・受け取る人）、支出一覧 |
| 支出追加 | `/groups/[groupId]/expenses/new` | 内容・金額・立て替えた人・割る対象者を入力して支出を追加。1人あたりの目安金額も表示 |

## 技術構成

| 用途 | 使用技術 |
| --- | --- |
| フレームワーク | Next.js 16（App Router） / React 19 |
| データ取得 | SWR |
| データベース | Neon（Postgres、`aws-ap-southeast-1`） |
| ORM / マイグレーション | Drizzle ORM / drizzle-kit |
| 入力チェック | zod |
| フォント | Zen Maru Gothic（見出し・金額） / Zen Kaku Gothic New（本文） |
| ホスティング | Vercel |

## ディレクトリ構成

```
src/
├── app/                      # ルーティング（ページと Route Handler）
│   ├── globals.css           # 配色・フォント・全コンポーネントのスタイル
│   └── api/groups/...        # 読み取り用 API（GET）
├── components/               # UI コンポーネント
│   ├── GroupForm.tsx         # グループ作成フォーム
│   ├── GroupHeader.tsx       # グループ名・サマリー・共有欄
│   ├── ShareLink.tsx         # URL の表示とコピー
│   ├── SettlementResult.tsx  # 精算結果
│   ├── ExpenseList.tsx       # 支出一覧
│   ├── ExpenseForm.tsx       # 支出追加フォーム
│   ├── StatusMessage.tsx     # 読み込み中・見つからない場合の表示
│   └── memberLookup.ts       # メンバー ID から名前・並び順を引く補助関数
├── hooks/                    # データ取得用フック（useGroup / useExpenses / useRepository）
├── domain/                   # 型定義と精算ロジック（settlement.ts）
├── data/                     # データアクセス層
│   ├── repository.ts         # WarikanRepository インターフェース
│   ├── apiRepository.ts      # ブラウザ側の実装（Server Actions / API を呼ぶ）
│   ├── actions.ts            # 書き込み用 Server Actions（入力チェックもここ）
│   ├── drizzleRepository.ts  # サーバー側の実装（DB アクセス）
│   └── validation.ts         # zod スキーマ
└── db/                       # Drizzle のスキーマと DB 接続
drizzle/                      # 生成されたマイグレーション SQL
```

## アーキテクチャ

画面とフックは `WarikanRepository` インターフェースにのみ依存しています。
DB の接続情報はサーバー側にだけ置き、書き込みは Server Actions、読み取りは Route Handler 経由で行います。

```
画面 / フック
   ↓ WarikanRepository
ApiRepository（ブラウザ）
   ↓ Server Actions（書き込み） / Route Handler（読み取り）
DrizzleRepository（サーバー）
   ↓
Neon（Postgres）
```

- 書き込み時はサーバー側で zod による入力チェックを行い、立て替えた人・割る対象者が同じグループのメンバーかも確認します
- グループの URL を知っていれば誰でも閲覧・追加できるため、グループ ID は推測できない UUID にしています

### データモデル

| テーブル | 内容 |
| --- | --- |
| `groups` | グループ（名前、作成日時） |
| `members` | メンバー（所属グループ、名前、並び順） |
| `expenses` | 支出（所属グループ、立て替えた人、金額〈円・整数〉、内容、作成日時） |
| `expense_participants` | 支出ごとの割る対象者（支出 × メンバー） |

グループを削除すると、メンバー・支出・割る対象者もまとめて削除されます。

### 精算の計算

[src/domain/settlement.ts](src/domain/settlement.ts) で計算しています。

1. 支出ごとに、金額を割る対象者の人数で割って1円未満を切り捨てる
2. 割り切れずに余った円は、メンバー順に1円ずつ負担する
3. 各メンバーの残高（立て替えた額 − 負担額）を出し、払う人と受け取る人を金額の大きい順に組み合わせて送金を決める

残高は常に整数で合計が0になるため、精算額に端数のズレは出ません。

## デザイン

スタイルはすべて [src/app/globals.css](src/app/globals.css) にまとめています。色は `:root` の CSS 変数で定義し、ダークモード用の値は `prefers-color-scheme: dark` で切り替えています。

| 変数 | ライト | 用途 |
| --- | --- | --- |
| `--paper` | `#f7f1e5` | 背景（方眼紙） |
| `--card` | `#fffdf8` | カード |
| `--ink` / `--ink-soft` | `#3b3128` / `#6b5d50` | 本文 / 補足テキスト |
| `--accent` | `#b5532e` | 主ボタン・精算額 |
| `--tape` | 半透明のベージュ | マスキングテープ風の見出し |
| `--negative` / `--positive` | `#a8443a` / `#4f7a4a` | 「払う」「受け取る」のラベル、エラー表示 |

主な装飾クラス：`.tape`（テープ風見出し）、`.stamp`（スタンプ風バッジ）、`.card`、`.button` / `.buttonSecondary`、`.roleBadge`（払う・受け取るのラベル）

## ローカル開発

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` に以下を設定します（Git 管理外）。

| 変数名 | 用途 |
| --- | --- |
| `DATABASE_URL` | アプリが使う接続先（pooler 経由、ホスト名に `-pooler` を含む） |
| `DATABASE_URL_UNPOOLED` | マイグレーション用の直接接続 |

Neon CLI を使う場合は、プロジェクトに紐付けると自動で書き込まれます。

```bash
npx neon@latest login
npx neon@latest link
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 を開きます。

> **注意**：現在はローカルと本番が同じ DB を使っています。ローカルで作成したグループや支出は本番にも表示されます。

## データベースのスキーマ変更

スキーマは [src/db/schema.ts](src/db/schema.ts) で管理しています。変更したら、マイグレーションを生成して適用します。

```bash
npm run db:generate   # drizzle/ にマイグレーション SQL を生成
npm run db:migrate    # DATABASE_URL_UNPOOLED の DB に適用
```

生成された `drizzle/` 配下の SQL もコミットしてください。
本番とローカルは同じ DB を使っているため、`db:migrate` は本番に反映されます。

## デプロイ

`main` ブランチに push すると Vercel が自動でデプロイします。

Vercel の環境変数には `DATABASE_URL`（Production / Preview）を登録しています。
スキーマ変更を含む場合は、push する前に `npm run db:migrate` を実行してください。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番ビルドを起動 |
| `npm run lint` | ESLint を実行 |
| `npm run db:generate` | マイグレーション SQL を生成 |
| `npm run db:migrate` | マイグレーションを DB に適用 |
