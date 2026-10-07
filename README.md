# WARIKAN

グループで立て替えた支出を記録し、誰が誰にいくら払えばよいかを自動で計算する割り勘アプリです。

- ログイン不要。グループを作成すると発行される URL を共有すれば、メンバー全員が同じデータを閲覧・追加できます
- 精算は1円単位で計算し、割り切れない端数はメンバー順に1円ずつ負担します

本番環境: https://warikan-gold.vercel.app

## 技術構成

| 用途 | 使用技術 |
| --- | --- |
| フレームワーク | Next.js 16（App Router） / React 19 |
| データ取得 | SWR |
| データベース | Neon（Postgres、`aws-ap-southeast-1`） |
| ORM / マイグレーション | Drizzle ORM / drizzle-kit |
| 入力チェック | zod |
| ホスティング | Vercel |

## ディレクトリ構成

```
src/
├── app/                    # ルーティング（ページと Route Handler）
│   └── api/groups/...      # 読み取り用 API（GET）
├── components/             # UI コンポーネント
├── hooks/                  # データ取得用フック（useGroup / useExpenses / useRepository）
├── domain/                 # 型定義と精算ロジック（settlement.ts）
├── data/                   # データアクセス層
│   ├── repository.ts       # WarikanRepository インターフェース
│   ├── apiRepository.ts    # ブラウザ側の実装（Server Actions / API を呼ぶ）
│   ├── actions.ts          # 書き込み用 Server Actions（入力チェックもここ）
│   ├── drizzleRepository.ts# サーバー側の実装（DB アクセス）
│   └── validation.ts       # zod スキーマ
└── db/                     # Drizzle のスキーマと DB 接続
drizzle/                    # 生成されたマイグレーション SQL
```

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
