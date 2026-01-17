# システム構成定義書：gRPCベース・マイクロサービスプラットフォーム

## 1. プロジェクト概要

本プロジェクトは、スケーラビリティと型安全性を追求したモダンなE-Commerce基盤です。マイクロサービスアーキテクチャを採用し、複雑なドメインロジックをDDDで制御しつつ、インフラからフロントエンドまでを一貫したスキーマ駆動で開発します。

---

## 2. サービス機能要件

技術習得に最適な、ドメインの複雑さを伴う3つの機能を主軸にします。

- **マルチテナント・カタログ機能**:
- ショップごとに独立した商品管理、カテゴリ構造。
- Fluent UIを活用した、高密度な在庫・価格一括更新インターフェース。

- **高信頼な注文・在庫引当**:
- Redisによる分散ロックを用いた、ミミリ秒単位の在庫競合制御。
- gRPCによるサービス間連携（注文 ↔ 在庫）。

- **テナント管理ダッシュボード**:
- 売上統計の可視化。
- RBAC（ロールベースアクセス制御）による運営者・ショップオーナーの権限分離。

---

## 3. テクニカルスタック（Best Practices 2026）

| カテゴリ          | 選定技術                | 役割・選定理由                                            |
| ----------------- | ----------------------- | --------------------------------------------------------- |
| **Frontend**      | React, TypeScript, Vite | **Fluent UI React v9** によるエンタープライズ品質のUI実装 |
| **Backend**       | Kotlin, Ktor            | 非同期Coroutinesによる高効率なリクエスト処理              |
| **Communication** | gRPC / gRPC-Web         | スキーマ駆動（Protocol Buffers）による厳密な型安全性      |
| **IaC**           | AWS CDK (TypeScript)    | アプリケーションとインフラを同一言語・型で管理            |
| **Data Store**    | PostgreSQL, Redis       | **Exposed ORM** による型安全なクエリと分散ロックの実装    |
| **Monorepo**      | Turborepo               | キャッシュ共有による爆速なビルド・デプロイパイプライン    |
| **DevOps**        | Docker, Envoy Proxy     | gRPC-Web変換およびローカル環境のコンテナ化                |

---

## 4. システムアーキテクチャ

### アーキテクチャの特徴

- **Domain-Driven Design (DDD)**: 境界づけられたコンテキストに基づき、`Order`, `Inventory`, `Catalog` などのサービスを分離。
- **Clean Architecture**: 各サービス内部は `Domain`, `UseCase`, `Infrastructure`, `Presentation` の4層構造を維持し、ビジネスロジックをフレームワークから分離。
- **BFF (Backend For Frontend) パターン**: Ktorをゲートウェイとして配置。認証、ロギング、複数サービスからのデータ集約を担います。
- **Envoy Proxy**: サイドカーまたはフロントプロキシとして配置。ブラウザからのgRPC-Web通信をHTTP/2 gRPCへ変換。
- **Database per Service**: 各サービスは独自のPostgreSQLインスタンス（または論理分離）を持ち、疎結合を維持。

---

## 5. プロジェクト構成 (Turborepo)

```text
.
├── apps/
│   ├── admin-panel/         # [React] 管理画面。Fluent UIのDataGridを多用
│   ├── web-store/           # [React] 公開ストア。gRPC-WebでBFFと通信
│   ├── bff-gateway/         # [Ktor] 認証・認可・リクエスト集約
│   ├── service-order/       # [Ktor] 注文ドメイン (DDD/Clean Architecture)
│   └── service-inventory/   # [Ktor] 在庫ドメイン (Redis排他制御)
├── packages/
│   ├── grpc-schema/         # .proto ファイル定義 (Single Source of Truth)
│   ├── grpc-gen/            # 自動生成されたTS/Kotlinコード
│   ├── ui-core/             # Fluent UIをラップしたドメイン共通コンポーネント
│   └── shared-utils/        # 共通のバリデーションや例外処理定義
├── infra/                   # << AWS CDK >>
│   ├── lib/
│   │   ├── storage-stack.ts # RDS, Redis, S3
│   │   └── compute-stack.ts # ECS Fargate, Envoy, ALB
│   └── bin/cdk.ts
└── docker/                  # Local開発用 (Envoy config, docker-compose)

```

---

## 6. 実装ロードマップ

### Phase 1: モノレポ・基盤構築

- **Turborepo & gRPC**: `.proto` からの自動生成環境を構築。
- **Local Docker**: Envoy Proxy, PostgreSQL, Redisを立ち上げ、ReactからKtorへのgRPC疎通を確認。

### Phase 2: ドメイン実装 & DDD

- **Core Domain**: `service-inventory` を実装。Clean Architectureに基づき、ドメインロジックを純粋なKotlinで記述。
- **Fluent UI**: `admin-panel` で、在庫一覧の管理画面を構築。

### Phase 3: インフラコード化 & デプロイ

- **AWS CDK**: VPC, ECS, RDSを定義。
- **CI/CD**: GitHub Actionsを用いた自動デプロイパイプラインの作成。

### Phase 4: 応用・耐障害性

- **Resilience**: リトライ処理、サーキットブレーカーの導入。
- **Observability**: AWS X-Rayを用いた分散トレーシングの実装。

---

### 次のステップへの提案

この構成で最初に取り組むべきは、**「商品情報の取得」**というシンプルなユースケースを、`.proto` の定義から React での表示まで垂直に貫通させることです。
