# 長崎県茂木取材記録アプリ

長崎県茂木の魅力的なコンテンツを取材・記録するアプリケーション

## 技術スタック

- **フロントエンド**: Next.js 16.1.6 (App Router)
- **データベース**: PostgreSQL (Neon / Docker)
- **UI**: Radix UI + Tailwind CSS
- **言語**: TypeScript

## セットアップ手順

### オプションA: Neon Database（本番環境推奨）

Vercelにデプロイする場合や本番環境ではNeonを使用することを推奨します。

#### 1. Neonプロジェクトの作成

1. [Neon](https://neon.tech) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. 接続文字列（Connection String）をコピー

#### 2. データベースの初期化

Neonのコンソールで以下のSQLを実行:

```bash
# scripts/setup-neon.sql の内容をNeon SQLエディタで実行
```

または、`psql`コマンドで実行:

```bash
psql "your-neon-connection-string" -f scripts/setup-neon.sql
```

#### 3. 環境変数の設定

`.env.local` ファイルを作成:

```env
DATABASE_URL=your-neon-connection-string
```

Vercelにデプロイする場合は、Vercelのプロジェクト設定で環境変数を設定してください。

---

### オプションB: ローカルDocker（開発環境）

ローカル開発では、Docker Composeを使用してPostgreSQLを起動できます。

## セットアップ手順（Docker）

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. Docker Desktopでデータベースを起動

```bash
docker-compose up -d
```

データベースの状態を確認:
```bash
docker-compose ps
```

### 3. 環境変数の確認

`.env.local` ファイルが作成されていることを確認してください。

```
DATABASE_URL=postgresql://ryu_user:ryu_password@localhost:5432/ryu_san_db
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

アプリケーションは http://localhost:3000 で起動します。

## 機能

- ✅ 取材記録の作成
- ✅ 取材記録の一覧表示
- ✅ 取材記録の詳細表示
- ✅ 取材記録の検索（取材相手名、内容で検索）
- ✅ 取材記録の削除

## データベース管理

### PostgreSQLコンテナに接続

```bash
docker exec -it ryu-san-postgres psql -U ryu_user -d ryu_san_db
```

### データベースを停止

```bash
docker-compose down
```

### データベースを削除（ボリュームも削除）

```bash
docker-compose down -v
```

## トラブルシューティング

### データベースに接続できない場合

1. Docker Desktopが起動しているか確認
2. PostgreSQLコンテナが起動しているか確認: `docker-compose ps`
3. 環境変数が正しく設定されているか確認

### ポート5432が使用中の場合

`docker-compose.yml` のポート番号を変更してください:

```yaml
ports:
  - "5433:5432"  # ホスト側を5433に変更
```

`.env.local` も更新:
```
DATABASE_URL=postgresql://ryu_user:ryu_password@localhost:5433/ryu_san_db
```

## Vercelへのデプロイ

### 1. Neonデータベースのセットアップ

1. [Neon](https://neon.tech) で新しいプロジェクトを作成
2. 接続文字列をコピー（例: `postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`）
3. Neon SQLエディタで `scripts/setup-neon.sql` の内容を実行してテーブルを作成

### 2. Vercelプロジェクトの設定

1. GitHubリポジトリをVercelにインポート
2. Vercelプロジェクトの Settings → Environment Variables で以下を設定:
   - `DATABASE_URL`: Neonの接続文字列を設定

### 3. デプロイ

```bash
git push origin main
```

Vercelが自動的にビルド・デプロイします。
