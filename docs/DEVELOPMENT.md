# 開発ガイド

## 目次

1. [開発環境のセットアップ](#開発環境のセットアップ)
2. [バージョン要件](#バージョン要件)
3. [コーディング規約](#コーディング規約)
4. [新機能の追加方法](#新機能の追加方法)
5. [テスト](#テスト)
6. [デバッグ](#デバッグ)
7. [よくある問題](#よくある問題)

---

## 開発環境のセットアップ

### バージョン要件

| ツール  | 最小バージョン | 推奨バージョン |
| ------- | -------------- | -------------- |
| Node.js | 20.0.0         | 20.11+ (LTS)   |
| pnpm    | 9.0.0          | 9.15.0         |
| JDK     | 21             | 21             |
| Docker  | 20.0           | 最新           |
| Kotlin  | 2.0.0          | 2.0.21         |

> 📢 最新版対応状況は [VERSION_UPDATES.md](./VERSION_UPDATES.md) を参照してください。

### 推奨IDE

#### フロントエンド（TypeScript/React）

- **Visual Studio Code**
- 推奨拡張機能:
  - ESLint (v9対応)
  - Prettier
  - TypeScript and JavaScript Language Features
  - React Extension Pack

#### バックエンド（Kotlin）

- **IntelliJ IDEA** (Ultimate または Community)
- 推奨プラグイン:
  - Kotlin
  - Gradle
  - Database Tools and SQL

### 初回セットアップ手順

#### 1. pnpmのインストール

```bash
# Corpackを使用（推奨）
corepack enable
corepack prepare pnpm@9.15.0 --activate

# または npm経由
npm install -g pnpm@9.15.0
```

#### 2. 依存関係のインストール

```bash
# ルートディレクトリで実行
pnpm install
```

初回インストールには数分かかる場合があります。

#### 3. 環境変数設定

`.env`ファイルを作成:

```bash
# ルートディレクトリ（必要に応じて）
cp .env.example .env

# admin-panel
cp apps/admin-panel/.env.example apps/admin-panel/.env

# service-inventory
cp apps/service-inventory/.env.example apps/service-inventory/.env
```

各環境変数の例:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/ecommerce
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# gRPC
GRPC_PORT=50051
HTTP_PORT=8080
```

---

## コーディング規約

### TypeScript/React

#### ファイル命名

```
PascalCase: コンポーネントファイル
  ProductList.tsx
  ErrorBoundary.tsx

camelCase: ユーティリティファイル
  productService.ts
  validation.ts
```

#### コンポーネント設計

```tsx
/**
 * コンポーネントの説明
 *
 * 使い方の例や注意事項を記載
 */
export interface ProductCardProps {
  /** 商品データ */
  product: Product;
  /** クリック時のコールバック */
  onClick?: (product: Product) => void;
}

/**
 * ProductCardコンポーネント
 */
export function ProductCard({ product, onClick }: ProductCardProps) {
  // 早期リターンを活用
  if (!product) return null;

  // カスタムフックは上部で呼び出し
  const styles = useStyles();

  // イベントハンドラ
  const handleClick = useCallback(() => {
    onClick?.(product);
  }, [product, onClick]);

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}
```

#### 型定義

```typescript
// インターフェースよりも type を優先
type Product = {
  id: string;
  name: string;
  price: number;
};

// Union型を活用
type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

// ジェネリクスで再利用性を高める
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### Kotlin

#### ファイル命名

```
PascalCase: クラスファイル
  Product.kt
  ProductRepository.kt

camelCase: 拡張関数ファイル
  stringExtensions.kt
```

#### クラス設計

```kotlin
/**
 * 商品エンティティ
 *
 * DDDにおけるエンティティです。
 * ビジネスルールをメソッドとして表現します。
 */
data class Product(
    val id: ProductId,
    val name: String,
    val price: Price,
    val stockQuantity: Int,
    val status: ProductStatus
) {
    /**
     * 在庫を引き当てる
     *
     * @param quantity 引き当て数量
     * @return 在庫引き当て後の新しいProductインスタンス
     * @throws IllegalArgumentException 在庫不足の場合
     */
    fun allocateStock(quantity: Int): Product {
        require(quantity > 0) { "数量は1以上である必要があります" }
        require(canAllocate(quantity)) { "在庫不足" }

        return copy(stockQuantity = stockQuantity - quantity)
    }

    private fun canAllocate(quantity: Int): Boolean {
        return status == ProductStatus.ACTIVE && stockQuantity >= quantity
    }
}
```

#### コーディングスタイル

```kotlin
// Immutableを優先
val product = Product(...)  // ✅
var product = Product(...)  // ❌

// Null安全性を活用
fun findProduct(id: String): Product? {
    return products.find { it.id == id }
}

// スコープ関数を適切に使用
product?.let { p ->
    println("商品名: ${p.name}")
}

// when式を活用
val message = when (status) {
    ProductStatus.DRAFT -> "下書き"
    ProductStatus.ACTIVE -> "公開中"
    ProductStatus.INACTIVE -> "非公開"
}
```

---

## 新機能の追加方法

### 1. Protocol Buffersスキーマの定義

```protobuf
// packages/grpc-schema/proto/catalog.proto

message CreateProductRequest {
  string tenant_id = 1;
  string name = 2;
  string description = 3;
  int64 price = 4;
}

message CreateProductResponse {
  Product product = 1;
}

service CatalogService {
  rpc CreateProduct(CreateProductRequest) returns (CreateProductResponse);
}
```

### 2. コード生成

```bash
cd packages/grpc-schema
pnpm proto:generate
```

### 3. ドメインモデルの実装

```kotlin
// Domain Layer
data class Product(
    val id: ProductId,
    val name: String,
    // ...
)

// Repository Interface
interface ProductRepository {
    suspend fun save(product: Product): Product
}
```

### 4. ユースケースの実装

```kotlin
// Use Case Layer
class CreateProductUseCase(
    private val productRepository: ProductRepository
) {
    suspend fun execute(request: CreateProductRequest): Product {
        // ビジネスロジック
        val product = Product(...)
        return productRepository.save(product)
    }
}
```

### 5. インフラストラクチャの実装

```kotlin
// Infrastructure Layer
class ProductRepositoryImpl : ProductRepository {
    override suspend fun save(product: Product): Product {
        // データベースアクセス
    }
}
```

### 6. gRPCサービスの実装

```kotlin
// Presentation Layer
class CatalogGrpcService : CatalogServiceGrpcKt.CatalogServiceCoroutineImplBase() {
    override suspend fun createProduct(
        request: CreateProductRequest
    ): CreateProductResponse {
        val product = createProductUseCase.execute(request)
        return CreateProductResponse.newBuilder()
            .setProduct(product.toProto())
            .build()
    }
}
```

### 7. フロントエンドの実装

```typescript
// Service
export async function createProduct(
  request: CreateProductRequest
): Promise<Product> {
  // gRPC-Webクライアントの呼び出し
}

// Component
function CreateProductForm() {
  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // 成功時の処理
    },
  });

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## テスト

### テスト実行

#### フロントエンドテスト（全パッケージ）

```bash
# すべてのテストを実行
pnpm test

# 特定のパッケージのみ
pnpm --filter @ecommerce/shared-utils test
pnpm --filter @ecommerce/ui-core test
pnpm --filter @ecommerce/admin-panel test

# ウォッチモード
pnpm test:watch

# カバレッジ計測
pnpm test:coverage
```

#### バックエンドテスト（Kotlin）

```bash
cd apps/service-inventory

# すべてのテストを実行
./gradlew test

# 特定のテストクラスのみ
./gradlew test --tests "com.ecommerce.inventory.domain.model.ProductTest"

# ビルド＋テスト
./gradlew build
```

### テスト構成

#### フロントエンド（TypeScript）

**総テスト数**: 139テスト

| パッケージ   | テスト数 | 内容                                             |
| ------------ | -------- | ------------------------------------------------ |
| shared-utils | 96       | エラー、UUID、バリデーション、日時、フォーマット |
| ui-core      | 35       | カスタムフック（5種類）                          |
| admin-panel  | 8        | 商品サービスAPI                                  |

**テストフレームワーク**:

- Vitest 4.0.17
- @testing-library/react 16.3.1
- happy-dom（DOM環境）

#### バックエンド（Kotlin）

**総テスト数**: 45テスト

| テストクラス                 | テスト数 | 内容                             |
| ---------------------------- | -------- | -------------------------------- |
| ProductTest                  | 16       | ドメインモデル、ビジネスロジック |
| ProductRepositoryImplTest    | 11       | データベースアクセス層（H2）     |
| GetProductUseCaseTest        | 2        | 商品取得ユースケース             |
| ListProductsUseCaseTest      | 5        | 商品一覧取得ユースケース         |
| CreateProductUseCaseTest     | 2        | 商品作成ユースケース             |
| ProductId/TenantId/PriceTest | 9        | 値オブジェクト                   |

**テストフレームワーク**:

- JUnit Jupiter 5.10.1
- MockK 1.13.9
- kotlinx-coroutines-test 1.8.1
- H2 Database 2.2.224（テスト用）

### ユニットテスト（Kotlin）

#### ドメインモデルのテスト

```kotlin
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class ProductTest {
    @Test
    fun `在庫引き当てが正しく動作する`() {
        // Given
        val baseTime = Instant.parse("2026-01-18T10:00:00Z")
        val baseClock = Clock.fixed(baseTime, ZoneId.of("UTC"))
        val product = Product(
            id = ProductId.generate(),
            stockQuantity = 10,
            status = ProductStatus.ACTIVE,
            updatedAt = baseTime
        )

        // When
        val newTime = Instant.parse("2026-01-18T10:00:01Z")
        val newClock = Clock.fixed(newTime, ZoneId.of("UTC"))
        val result = product.allocateStock(5, newClock)

        // Then
        assertEquals(5, result.stockQuantity)
        assertEquals(newTime, result.updatedAt)
    }

    @Test
    fun `在庫不足の場合は例外がスローされる`() {
        val product = Product(stockQuantity = 3)

        assertThrows<IllegalArgumentException> {
            product.allocateStock(5)
        }
    }
}
```

**Clock注入パターン**: 時刻依存のテストを決定的にするため、`Clock`パラメータを使用しています。

#### ユースケースのテスト（MockK使用）

```kotlin
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test

class GetProductUseCaseTest {
    private val productRepository = mockk<ProductRepository>()
    private val useCase = GetProductUseCase(productRepository)

    @Test
    fun `商品が存在する場合は正常に取得できる`() = runTest {
        // Given
        val product = createTestProduct()
        coEvery {
            productRepository.findById(any(), any())
        } returns product

        // When
        val result = useCase.execute(
            productId = "550e8400-e29b-41d4-a716-446655440000",
            tenantId = "test-tenant"
        )

        // Then
        assertEquals(product, result)
        coVerify {
            productRepository.findById(
                ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
                TenantId("test-tenant")
            )
        }
    }
}
```

**ポイント**:

- `runTest`: コルーチンテスト用のスコープ
- `coEvery`: suspend関数のモック
- `coVerify`: suspend関数の呼び出し検証

#### インテグレーションテスト（H2使用）

```kotlin
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.AfterEach
import kotlinx.coroutines.test.runTest

class ProductRepositoryImplTest {
    private lateinit var database: Database
    private lateinit var repository: ProductRepository

    @BeforeEach
    fun setup() {
        database = Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )
        transaction(database) {
            SchemaUtils.create(ProductTable)
        }
        repository = ProductRepositoryImpl()
    }

    @AfterEach
    fun teardown() {
        transaction(database) {
            SchemaUtils.drop(ProductTable)
        }
    }

    @Test
    fun `新しい商品を正常に保存できる`() = runTest {
        // Given
        val product = createTestProduct()

        // When
        val saved = repository.save(product)

        // Then
        assertNotNull(saved)
        assertEquals(product.id, saved.id)
    }
}
```

### フロントエンドテスト

#### ユーティリティ関数のテスト（Vitest）

```typescript
import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidUrl } from './validation';

describe('validation', () => {
  describe('isValidEmail', () => {
    it('有効なメールアドレスを検証できる', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user+tag@domain.co.jp')).toBe(true);
    });

    it('無効なメールアドレスを拒否する', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });
});
```

#### カスタムフックのテスト

```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('指定時間後に値が更新される', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');

    // 500ms経過
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('initial');

    vi.useRealTimers();
  });
});
```

#### APIサービスのテスト

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchProducts } from './productService';

describe('productService', () => {
  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks();
  });

  it('商品一覧を取得できる', async () => {
    const result = await fetchProducts({ page: 1, pageSize: 20 });

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(2);
  });
});
```

### テストのベストプラクティス

#### 1. Given-When-Then パターン

テストを明確に構造化します：

```kotlin
@Test
fun `テストケース名`() {
    // Given: テストの前提条件
    val product = createTestProduct()

    // When: テスト対象の実行
    val result = product.allocateStock(5)

    // Then: 結果の検証
    assertEquals(5, result.stockQuantity)
}
```

#### 2. Clock注入パターン

時刻依存のテストを決定的にします：

```kotlin
// 本番コード
fun allocateStock(quantity: Int, clock: Clock = Clock.systemUTC()): Product {
    return copy(updatedAt = Instant.now(clock))
}

// テストコード
@Test
fun `updatedAtが更新される`() {
    val fixedClock = Clock.fixed(Instant.parse("2026-01-18T10:00:00Z"), ZoneId.of("UTC"))
    val result = product.allocateStock(5, fixedClock)
    assertEquals(Instant.parse("2026-01-18T10:00:00Z"), result.updatedAt)
}
```

#### 3. モックの適切な使用

依存関係をモック化してユニットテストを隔離します：

```kotlin
// ✅ 良い例：リポジトリをモック化
private val productRepository = mockk<ProductRepository>()

// ❌ 悪い例：実際のデータベースを使用（ユニットテストではない）
private val productRepository = ProductRepositoryImpl()
```

#### 4. テストの独立性

各テストは独立して実行できるようにします：

```kotlin
@BeforeEach
fun setup() {
    // 各テスト前に初期化
    database = Database.connect(...)
}

@AfterEach
fun teardown() {
    // 各テスト後にクリーンアップ
    transaction { SchemaUtils.drop(ProductTable) }
}
```

### テストカバレッジ

```bash
# フロントエンド
pnpm test:coverage

# バックエンド
./gradlew test jacocoTestReport
```

カバレッジレポートは以下に出力されます：

- フロントエンド: `coverage/index.html`
- バックエンド: `build/reports/jacoco/test/html/index.html`

---

## デバッグ

### バックエンドのデバッグ

IntelliJ IDEAでリモートデバッグ:

1. Run → Edit Configurations
2. Add New Configuration → Remote JVM Debug
3. ポート: 5005
4. サーバー起動時に `-agentlib:jdwp` を追加

### フロントエンドのデバッグ

Chrome DevTools:

- React Developer Tools 拡張機能を使用
- Network タブでgRPC-Web通信を確認
- Console でエラーログを確認

### データベースのデバッグ

```sql
-- 商品データの確認
SELECT * FROM products ORDER BY created_at DESC LIMIT 10;

-- 実行計画の確認
EXPLAIN ANALYZE
SELECT * FROM products WHERE tenant_id = 'demo-tenant';
```

---

## よくある問題

### gRPCサービスに接続できない

**症状**: フロントエンドからバックエンドに接続できない

**解決策**:

1. Envoyが起動しているか確認: `docker-compose ps`
2. gRPCサーバーが起動しているか確認
3. ポート番号が正しいか確認（8081）

### データベース接続エラー

**症状**: `Connection refused` エラー

**解決策**:

1. PostgreSQLが起動しているか確認
2. 環境変数が正しいか確認
3. Docker Composeを再起動: `docker-compose restart postgres`

### ビルドエラー

**症状**: `pnpm build` が失敗する

**解決策**:

1. 依存関係を再インストール: `pnpm install --force`
2. node_modulesを削除して再インストール
3. Turborepoキャッシュをクリア: `pnpm clean`

---

---

## Storybook

### 概要

Storybook 10を使用して、UIコンポーネントの開発・テスト・ドキュメント化を行います。

**対象パッケージ**: `packages/ui-core`

### 起動方法

```bash
# ui-coreパッケージでStorybookを起動
cd packages/ui-core
pnpm storybook

# またはルートから
pnpm --filter @ecommerce/ui-core storybook
```

ブラウザで http://localhost:6006 を開くと、Storybookが表示されます。

### ビルド

```bash
# Storybookを静的ファイルとしてビルド
pnpm --filter @ecommerce/ui-core build-storybook

# 出力先: packages/ui-core/storybook-static/
```

### 主な機能

#### 1. コンポーネントカタログ

すべてのUIコンポーネントを独立した環境で確認できます：

- **Components**
  - DataTable - データテーブル
  - ErrorBoundary - エラーハンドリング
  - LoadingSpinner - ローディング表示
  - PageHeader - ページヘッダー

- **Hooks**
  - Custom Hooks - カスタムフック集

#### 2. テーマ切り替え

ツールバーから簡単にLight/Darkテーマを切り替えられます：

- 🌞 Light Theme (Fluent UI webLightTheme)
- 🌙 Dark Theme (Fluent UI webDarkTheme)

#### 3. レスポンシブテスト

ビューポートアドオンで異なる画面サイズをテスト：

- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

#### 4. アクセシビリティチェック

a11yアドオンで自動的にアクセシビリティの問題を検出します。

### 新しいStoryの作成

#### コンポーネントのStory

```tsx
// src/components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

/**
 * MyComponentの説明
 */
const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'], // 自動ドキュメント生成
  argTypes: {
    // プロパティの説明とコントロール設定
    label: {
      control: 'text',
      description: 'ボタンのラベル',
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの表示
 */
export const Default: Story = {
  args: {
    label: 'クリック',
  },
};

/**
 * プライマリーボタン
 */
export const Primary: Story = {
  args: {
    label: '送信',
    appearance: 'primary',
  },
};
```

#### カスタムフックのStory

フックはデモコンポーネントを作成して表示します：

```tsx
// src/hooks/useMyHook.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useMyHook } from './useMyHook';

const DemoComponent = () => {
  const value = useMyHook();
  return <div>Value: {value}</div>;
};

const meta = {
  title: 'Hooks/useMyHook',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;

export const Demo: StoryObj = {
  render: () => <DemoComponent />,
};
```

### ベストプラクティス

#### 1. 包括的なバリエーション

コンポーネントのすべての状態と使用パターンをカバーします：

```tsx
export const Default: Story = { ... };
export const Loading: Story = { ... };
export const Error: Story = { ... };
export const Empty: Story = { ... };
```

#### 2. 適切な説明

各Storyにわかりやすい説明を付けます：

```tsx
/**
 * 長いテキストの場合
 *
 * テキストが長い場合、自動的に省略されて表示されます。
 */
export const LongText: Story = {
  args: { ... },
  parameters: {
    docs: {
      description: {
        story: '追加の詳細な説明をここに記載できます。',
      },
    },
  },
};
```

#### 3. インタラクションテスト

ユーザーインタラクションをテストできます：

```tsx
import { userEvent, within } from '@storybook/test';

export const ClickInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```

### トラブルシューティング

#### Storybookが起動しない

```bash
# node_modulesを再インストール
cd packages/ui-core
rm -rf node_modules
pnpm install

# Storybookを再起動
pnpm storybook
```

#### 型エラーが出る

```bash
# 型チェックを実行
pnpm type-check

# TypeScriptの設定を確認
cat tsconfig.json
```

#### ホットリロードが動作しない

Viteの設定やファイルウォッチャーの制限を確認してください。

---

## さらなる学習

- [Clean Architecture詳細](./ARCHITECTURE.md)
- [Protocol Buffers ガイド](../packages/grpc-schema/README.md)
- [Fluent UI コンポーネント](https://react.fluentui.dev/)
- [Storybook 公式ドキュメント](https://storybook.js.org/docs)

開発中に困ったことがあれば、このドキュメントを更新してください！
