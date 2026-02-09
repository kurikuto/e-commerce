# E-Commerce Platform - gRPCベース・マイクロサービス

> スケーラビリティと型安全性を追求したモダンなE-Commerce基盤

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0-purple.svg)](https://kotlinlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Ktor](https://img.shields.io/badge/Ktor-3.3-087CFA.svg)](https://ktor.io/)

> 📢 **最新版に更新しました！** React 19.2, Ktor 3.3, Vite 6対応 - [更新内容を確認](docs/VERSION_UPDATES.md)

## 📋 目次

- [概要](#概要)
- [技術スタック](#技術スタック)
- [プロジェクト構成](#プロジェクト構成)
- [セットアップ](#セットアップ)
- [開発ガイド](#開発ガイド)
- [アーキテクチャ](#アーキテクチャ)
- [学習リソース](#学習リソース)

## 🎯 概要

このプロジェクトは、**技術習得**を目的とした実践的なE-Commerceプラットフォームです。

### 特徴

- **🚀 マイクロサービスアーキテクチャ**: 各サービスは独立してスケール可能
- **🔒 型安全性**: Protocol Buffersによるスキーマ駆動開発
- **🏗️ Clean Architecture**: ビジネスロジックとインフラを明確に分離
- **⚡ 高パフォーマンス**: gRPCによる高速な通信
- **🎨 モダンUI**: Fluent UI React v9によるエンタープライズ品質のUI
- **📦 モノレポ**: Turborepoによる効率的なビルド管理

### 実装済み機能

✅ **商品カタログ機能**

- 商品一覧表示（ページネーション対応）
- 商品詳細取得
- 商品作成

✅ **インフラ基盤**

- PostgreSQL データベース
- Redis キャッシュ
- Envoy Proxy（gRPC-Web変換）

## 🛠️ 技術スタック

### フロントエンド

| 技術             | バージョン | 用途                        |
| ---------------- | ---------- | --------------------------- |
| **React**        | 19.2       | UIライブラリ                |
| **TypeScript**   | 5.7        | 型安全性                    |
| **Vite**         | 6.0        | 高速ビルドツール            |
| **Fluent UI v9** | 9.54       | Microsoftのデザインシステム |
| **React Query**  | 5.62       | サーバー状態管理            |
| **React Router** | 7.1        | ルーティング                |

### バックエンド

| 技術            | バージョン | 用途                    |
| --------------- | ---------- | ----------------------- |
| **Kotlin**      | 2.0        | プログラミング言語      |
| **Ktor**        | 3.3        | 非同期Webフレームワーク |
| **gRPC**        | 1.60       | 高性能RPC               |
| **Exposed ORM** | 0.46       | 型安全なORM             |
| **PostgreSQL**  | 16         | リレーショナルDB        |
| **Redis**       | 7          | キャッシュ・分散ロック  |

### 開発基盤

| 技術            | バージョン | 用途                   |
| --------------- | ---------- | ---------------------- |
| **Turborepo**   | 2.3        | モノレポ管理           |
| **pnpm**        | 9.15       | パッケージマネージャー |
| **ESLint**      | 9.16       | コード品質管理         |
| **Docker**      | latest     | コンテナ化             |
| **Envoy Proxy** | latest     | gRPC-Web変換           |

## 📂 プロジェクト構成

```
e-commerce/
├── apps/                          # アプリケーション
│   ├── admin-panel/              # 管理画面（React + Vite）
│   │   ├── src/
│   │   │   ├── components/       # UIコンポーネント
│   │   │   ├── pages/            # ページコンポーネント
│   │   │   ├── services/         # APIクライアント
│   │   │   └── types/            # 型定義
│   │   └── vite.config.ts
│   │
│   └── service-inventory/        # 在庫サービス（Kotlin + Ktor）
│       ├── src/main/kotlin/
│       │   ├── domain/           # ドメイン層（ビジネスロジック）
│       │   ├── usecase/          # ユースケース層
│       │   ├── infrastructure/   # インフラ層（DB, gRPC）
│       │   └── presentation/     # プレゼンテーション層
│       └── build.gradle.kts
│
├── packages/                      # 共有パッケージ
│   ├── grpc-schema/              # Protocol Buffers定義
│   │   ├── proto/                # .protoファイル
│   │   └── scripts/              # コード生成スクリプト
│   │
│   ├── shared-utils/             # 共通ユーティリティ
│   │   └── src/
│   │       ├── validation.ts     # バリデーション
│   │       ├── errors.ts         # エラー処理
│   │       └── formatters.ts     # フォーマッター
│   │
│   └── ui-core/                  # UI共通コンポーネント
│       └── src/
│           ├── components/       # Fluent UIベースのコンポーネント
│           └── theme.ts          # テーマ設定
│
├── docker/                        # Docker関連
│   ├── envoy/                    # Envoy設定
│   └── init-db/                  # DB初期化スクリプト
│
├── docker-compose.yml            # ローカル環境定義
├── package.json                  # ルートパッケージ
├── turbo.json                    # Turborepo設定
└── pnpm-workspace.yaml          # pnpmワークスペース設定
```

## 🚀 セットアップ

### 前提条件

以下のツールがインストールされていることを確認してください：

- **Node.js** 20.x 以上
- **pnpm** 8.x 以上
- **Docker** & **Docker Compose**
- **Java** 21 以上（Kotlinビルド用）
- **Gradle** 8.x 以上

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd e-commerce
```

### 2. 環境変数の設定

```bash
# ルートディレクトリ
cp .env.example .env

# admin-panel
cp apps/admin-panel/.env.example apps/admin-panel/.env

# service-inventory
cp apps/service-inventory/.env.example apps/service-inventory/.env
```

### 3. 依存関係のインストール

```bash
# pnpmのインストール（未インストールの場合）
corepack enable
corepack prepare pnpm@9.15.0 --activate

# または npm経由
npm install -g pnpm@9.15.0

# 依存関係のインストール
pnpm install
```

### 4. Docker環境の起動

```bash
# PostgreSQL, Redis, Envoyを起動
docker compose up -d

# 起動確認
docker compose ps

# ログ確認
docker compose logs -f
```

### 5. バックエンドサービスの起動

```bash
# 在庫サービスのビルドと起動
cd apps/service-inventory
./gradlew build
./gradlew run

# 別のターミナルで
```

### 6. フロントエンドの起動

```bash
# 管理画面の起動
cd apps/admin-panel
pnpm dev

# ブラウザで http://localhost:3000 を開く
```

## 💻 開発ガイド

### よく使うコマンド

```bash
# 全体のビルド
pnpm build

# 全体の開発サーバー起動
pnpm dev

# リント検査
pnpm lint

# リント自動修正
pnpm lint:fix

# コードフォーマット
pnpm format

# 型チェック
pnpm type-check

# テスト実行
pnpm test

# Docker環境の管理
docker compose up -d         # 起動
docker compose down          # 停止
docker compose logs -f       # ログ表示
docker compose down -v       # データも含めて削除
```

### Protocol Buffersのコード生成

スキーマを変更した場合：

```bash
cd packages/grpc-schema
pnpm proto:generate
```

### データベースの確認

pgAdminにアクセス: http://localhost:5050

- Email: `admin@example.com`
- Password: `admin`

### Redis の確認

```bash
docker exec -it ecommerce-redis redis-cli
```

### Envoy管理画面

http://localhost:9901

### Turborepoの活用

```bash
# 特定のパッケージのみビルド
pnpm build --filter=admin-panel

# 特定のパッケージのみ開発モード
pnpm dev --filter=service-inventory

# 依存関係を含めてビルド
pnpm build --filter=admin-panel...

# すべてのチェックを実行
pnpm lint && pnpm type-check && pnpm build
```

## 🏗️ アーキテクチャ

### システム構成図

```
┌─────────────┐
│  Browser    │
│  (React)    │
└──────┬──────┘
       │ HTTP/gRPC-Web
       ↓
┌─────────────┐
│   Envoy     │ ← gRPC-Web → gRPC変換
└──────┬──────┘
       │ gRPC (HTTP/2)
       ↓
┌─────────────┐     ┌─────────────┐
│  Inventory  │────→│ PostgreSQL  │
│  Service    │     └─────────────┘
│  (Kotlin)   │
└──────┬──────┘     ┌─────────────┐
       └────────────→│   Redis     │
                     └─────────────┘
```

### Clean Architecture 構成

```
┌──────────────────────────────────────┐
│         Presentation Layer           │  ← gRPC Service
├──────────────────────────────────────┤
│          Use Case Layer              │  ← Business Logic
├──────────────────────────────────────┤
│          Domain Layer                │  ← Entities, Value Objects
├──────────────────────────────────────┤
│       Infrastructure Layer           │  ← DB, Redis, External APIs
└──────────────────────────────────────┘
```

### データフロー

1. **フロントエンド** → ユーザー操作
2. **gRPC-Web** → EnvoyでgRPCに変換
3. **gRPC Server** → リクエスト受信
4. **Use Case** → ビジネスロジック実行
5. **Repository** → データベースアクセス
6. **Response** → 結果を返す

## 📚 学習リソース

### ドキュメント

- [バージョン更新ガイド](docs/VERSION_UPDATES.md) - React 19.2, Ktor 3.3対応
- [実装チェックリスト](docs/IMPLEMENTATION_CHECKLIST.md) - 更新内容の確認
- [アーキテクチャ解説](docs/ARCHITECTURE.md) - 詳細な設計思想
- [開発ガイド](docs/DEVELOPMENT.md) - 開発フローとベストプラクティス

### Protocol Buffers & gRPC

- [Protocol Buffers公式](https://protobuf.dev/)
- [gRPC公式](https://grpc.io/)
- [gRPC-Web](https://github.com/grpc/grpc-web)

### Kotlin & Ktor

- [Kotlin公式](https://kotlinlang.org/)
- [Ktor 3.3ドキュメント](https://ktor.io/docs/)
- [Exposed ORM](https://github.com/JetBrains/Exposed)
- [kotlinx.coroutines](https://kotlinlang.org/docs/coroutines-guide.html)

### React & Fluent UI

- [React 19公式](https://react.dev/)
- [Fluent UI React v9](https://react.fluentui.dev/)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [React Router v7](https://reactrouter.com/)
- [Vite 6](https://vite.dev/)

### アーキテクチャパターン

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Microservices Patterns](https://microservices.io/)

## 🤝 コントリビューション

このプロジェクトは学習目的で作成されています。
プルリクエストや改善提案を歓迎します！

## 📄 ライセンス

MIT License

## 👨‍💻 作成者

学習用プロジェクトとして作成

---

**Happy Coding! 🚀**
