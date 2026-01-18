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
| JDK     | 17             | 21             |
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

`.env.local`ファイルを作成:

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

### ユニットテスト（Kotlin）

```kotlin
class ProductTest {
    @Test
    fun `在庫引き当てが正しく動作する`() {
        // Given
        val product = Product(
            id = ProductId.generate(),
            stockQuantity = 10,
            status = ProductStatus.ACTIVE
        )

        // When
        val result = product.allocateStock(5)

        // Then
        assertEquals(5, result.stockQuantity)
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

### コンポーネントテスト（React）

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('商品名が表示される', () => {
    const product = {
      id: '1',
      name: 'テスト商品',
      price: 1000,
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('テスト商品')).toBeInTheDocument();
  });
});
```

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
