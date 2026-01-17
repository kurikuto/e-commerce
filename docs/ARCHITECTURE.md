# アーキテクチャドキュメント

## 目次

1. [システム概要](#システム概要)
2. [アーキテクチャ原則](#アーキテクチャ原則)
3. [レイヤー構成](#レイヤー構成)
4. [データフロー](#データフロー)
5. [技術的決定事項](#技術的決定事項)

---

## システム概要

このシステムは、**マイクロサービスアーキテクチャ**と**Clean Architecture**を組み合わせた、
スケーラブルで保守性の高いE-Commerceプラットフォームです。

### 主要な特徴

- **境界づけられたコンテキスト**: DDDの原則に従い、ドメインを明確に分離
- **型安全性**: Protocol Buffersによるスキーマ駆動開発
- **疎結合**: 各サービスは独立してデプロイ・スケール可能
- **高パフォーマンス**: gRPCによる効率的な通信

---

## アーキテクチャ原則

### 1. Clean Architecture

各サービスは4つの層で構成されます：

```
┌───────────────────────────────────────┐
│     Presentation Layer (外側)         │  ← HTTP/gRPC Handler
│  - Controller                         │
│  - DTO Mapping                        │
├───────────────────────────────────────┤
│     Use Case Layer (アプリ層)         │  ← Business Flow
│  - Application Logic                  │
│  - Transaction Boundary               │
├───────────────────────────────────────┤
│     Domain Layer (中心)               │  ← Business Logic
│  - Entity                             │
│  - Value Object                       │
│  - Domain Service                     │
│  - Repository Interface               │
├───────────────────────────────────────┤
│     Infrastructure Layer (外側)       │  ← External Dependencies
│  - Repository Implementation          │
│  - Database Access                    │
│  - External API Client                │
└───────────────────────────────────────┘
```

#### 依存関係の方向

- **外側 → 内側**: インフラ層はドメイン層に依存
- **内側 ×→ 外側**: ドメイン層はインフラ層に依存しない（DIP）

### 2. Domain-Driven Design (DDD)

#### エンティティ（Entity）

一意な識別子を持ち、ライフサイクル全体を通じて追跡されるオブジェクト。

```kotlin
data class Product(
    val id: ProductId,  // 一意な識別子
    val name: String,
    val price: Price,
    // ... その他のプロパティ
)
```

#### 値オブジェクト（Value Object）

属性によって識別され、不変なオブジェクト。

```kotlin
@JvmInline
value class Price(val amount: Long) {
    init {
        require(amount >= 0) { "価格は0以上である必要があります" }
    }

    fun withTax(): Price = Price((amount * 1.1).toLong())
}
```

#### 集約（Aggregate）

整合性の境界を定義するエンティティの集まり。

#### リポジトリ（Repository）

集約の永続化と取得を抽象化するインターフェース。

```kotlin
interface ProductRepository {
    suspend fun save(product: Product): Product
    suspend fun findById(id: ProductId): Product?
}
```

### 3. マイクロサービス

各サービスは以下の特性を持ちます：

- **独立性**: 他のサービスに依存せず動作可能
- **自律性**: 独自のデータベースを持つ（Database per Service）
- **スケーラビリティ**: 負荷に応じて独立してスケール
- **技術的自由度**: 適切な技術スタックを選択可能

---

## レイヤー構成

### Domain Layer（ドメイン層）

**責務**: ビジネスルールとドメイン知識のカプセル化

**主要コンポーネント**:

- Entity: 一意な識別子を持つオブジェクト
- Value Object: 不変で属性によって識別されるオブジェクト
- Domain Service: 複数のエンティティにまたがるビジネスロジック
- Repository Interface: 永続化の抽象化

**特徴**:

- フレームワークに依存しない純粋なKotlinコード
- ビジネスルールを表現
- テストが容易

**例**:

```kotlin
// ドメインモデル
data class Product(
    val id: ProductId,
    val tenantId: TenantId,
    val name: String,
    val price: Price,
    val stockQuantity: Int,
    val status: ProductStatus
) {
    // ビジネスルールをメソッドとして表現
    fun allocateStock(quantity: Int): Product {
        require(canAllocate(quantity)) { "在庫不足" }
        return copy(stockQuantity = stockQuantity - quantity)
    }

    fun canAllocate(quantity: Int): Boolean {
        return status == ProductStatus.ACTIVE && stockQuantity >= quantity
    }
}
```

### Use Case Layer（ユースケース層）

**責務**: アプリケーションのビジネスフローの制御

**主要コンポーネント**:

- Use Case: 特定のユースケースの実装
- Input/Output DTO: ユースケースの入出力
- Transaction Boundary: トランザクション境界の定義

**特徴**:

- ドメインモデルを組み合わせてビジネスフローを実現
- トランザクション管理
- 外部サービスとの連携

**例**:

```kotlin
class CreateProductUseCase(
    private val productRepository: ProductRepository
) {
    suspend fun execute(request: CreateProductRequest): Product {
        // バリデーション
        require(request.name.isNotBlank()) { "商品名は必須" }

        // ドメインモデルの構築
        val product = Product(
            id = ProductId.generate(),
            tenantId = TenantId(request.tenantId),
            name = request.name,
            // ...
        )

        // 永続化
        return productRepository.save(product)
    }
}
```

### Infrastructure Layer（インフラ層）

**責務**: 外部システムとの接続

**主要コンポーネント**:

- Repository Implementation: データベースアクセスの実装
- Database Schema: テーブル定義
- External Client: 外部APIクライアント
- Cache: キャッシュ実装

**特徴**:

- Exposed ORMによる型安全なクエリ
- Redisによるキャッシュと分散ロック
- コネクションプーリング（HikariCP）

**例**:

```kotlin
class ProductRepositoryImpl : ProductRepository {
    override suspend fun save(product: Product): Product = dbQuery {
        ProductTable.insert {
            it[id] = product.id.value
            it[name] = product.name
            it[price] = product.price.amount
            // ...
        }
        product
    }

    override suspend fun findById(id: ProductId): Product? = dbQuery {
        ProductTable.select { ProductTable.id eq id.value }
            .map { it.toProduct() }
            .singleOrNull()
    }
}
```

### Presentation Layer（プレゼンテーション層）

**責務**: 外部とのインターフェース

**主要コンポーネント**:

- gRPC Service: gRPCエンドポイント
- Request/Response Mapping: Protocol BuffersとDTOの変換
- Error Handling: エラーのハンドリングとgRPC Statusへの変換

**特徴**:

- Protocol Buffersによる型安全な通信
- gRPC Statusによる標準的なエラー表現
- ストリーミング対応

**例**:

```kotlin
class CatalogGrpcService : CatalogServiceGrpcKt.CatalogServiceCoroutineImplBase() {
    override suspend fun getProduct(
        request: GetProductRequest
    ): GetProductResponse {
        return try {
            val product = getProductUseCase.execute(
                productId = request.id,
                tenantId = request.tenantId
            ) ?: throw StatusException(Status.NOT_FOUND)

            GetProductResponse.newBuilder()
                .setProduct(product.toProto())
                .build()
        } catch (e: Exception) {
            throw StatusException(Status.INTERNAL.withCause(e))
        }
    }
}
```

---

## データフロー

### リクエストフロー

```
1. Frontend (React)
   ↓ gRPC-Web Request
2. Envoy Proxy
   ↓ gRPC (HTTP/2)
3. gRPC Service (Presentation Layer)
   ↓ DTO → Domain Model
4. Use Case (Application Layer)
   ↓ Business Logic
5. Domain Model (Domain Layer)
   ↓ Repository Interface
6. Repository Impl (Infrastructure Layer)
   ↓ SQL Query
7. PostgreSQL Database
```

### レスポンスフロー

```
7. PostgreSQL Database
   ↑ Result Set
6. Repository Impl
   ↑ Domain Model
5. Domain Model
   ↑ Domain Model
4. Use Case
   ↑ Domain Model → DTO
3. gRPC Service
   ↑ Protocol Buffers
2. Envoy Proxy
   ↑ gRPC-Web Response
1. Frontend
```

---

## 技術的決定事項

### なぜKotlinを選んだか？

- **Null安全性**: コンパイル時にnullポインタ例外を防止
- **Coroutines**: 非同期処理を直感的に記述
- **Data Class**: ボイラープレートの削減
- **Inline Class**: オーバーヘッドなしで型安全性を向上

### なぜgRPCを選んだか？

- **高パフォーマンス**: HTTP/2とProtocol Buffersによる効率的な通信
- **型安全性**: スキーマ駆動による厳密な型チェック
- **双方向ストリーミング**: リアルタイム通信のサポート
- **言語間の互換性**: 多言語対応

### なぜExposed ORMを選んだか？

- **型安全**: DSLによるコンパイル時の型チェック
- **柔軟性**: 生SQLも使用可能
- **Kotlin Native**: Kotlinに最適化された設計

### なぜRedisを使うか？

- **高速**: インメモリによる高速アクセス
- **分散ロック**: 在庫競合制御に使用
- **キャッシュ**: データベースアクセスの削減

---

## まとめ

このアーキテクチャは以下の利点を提供します：

✅ **保守性**: 層の分離により変更の影響範囲が限定される
✅ **テスタビリティ**: 各層を独立してテスト可能
✅ **スケーラビリティ**: マイクロサービスとして独立してスケール
✅ **型安全性**: Protocol BuffersとKotlinによる厳密な型チェック
✅ **ビジネスロジックの保護**: ドメイン層がインフラから独立

このアーキテクチャにより、変化するビジネス要件に柔軟に対応できる
堅牢なシステムを構築できます。
