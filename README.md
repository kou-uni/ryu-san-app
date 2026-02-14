# 長崎県茂木取材記録アプリ

長崎県茂木の魅力的なコンテンツを取材・記録するアプリケーション

## 技術スタック

- **フロントエンド**: Next.js 16.1.6 (App Router)
- **データベース**: PostgreSQL (Docker)
- **UI**: Radix UI + Tailwind CSS
- **言語**: TypeScript

## セットアップ手順

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
