# バージョン更新ガイド

## 概要

このドキュメントは、プロジェクトの最新ライブラリバージョンへの更新内容と互換性情報をまとめています。

## 更新されたライブラリ

### フロントエンド

#### React 19.2.0

- **主な変更点**:
  - React Compilerのサポート（オプション）
  - より厳格な型定義
  - StrictModeの改善
  - 新しいドキュメントヘッダーAPI

- **互換性**:
  - `ReactDOM.createRoot()`は引き続き使用可能
  - `jsx: "react-jsx"`トランスフォーム推奨
  - @types/react@19.0.0が必要

#### Vite 6.0.5

- **主な変更点**:
  - 起動時間の大幅な改善
  - より良いESMサポート
  - 改善されたHMR（ホットモジュール置換）

- **設定更新**:
  ```typescript
  export default defineConfig({
    plugins: [
      react({
        jsxRuntime: 'automatic', // React 19.2推奨
      }),
    ],
    build: {
      target: 'esnext', // 最新のES仕様
    },
  });
  ```

#### Fluent UI v9.54.0

- **主な変更点**:
  - 新しいコンポーネント追加
  - アクセシビリティの改善
  - パフォーマンスの最適化

#### TanStack Query v5.62.0

- **主な変更点**:
  - React 19完全対応
  - 新しいdevtools
  - より良い型推論

#### React Router v7.1.0

- **主な変更点**:
  - React 19対応
  - データローディングの改善
  - 型安全性の向上
  - 現在のコードは完全に互換性あり

#### TypeScript 5.7.2

- **主な変更点**:
  - より厳格なnullチェック（`noUncheckedIndexedAccess`推奨）
  - パフォーマンスの改善
  - 新しい型操作機能

#### ESLint 9.16.0

- **主な変更点**:
  - フラットコンフィグ形式（`eslint.config.mjs`）が標準
  - より高速な実行
  - 新しいプラグインシステム

- **設定例**:

  ```javascript
  import js from '@eslint/js';
  import tseslint from 'typescript-eslint';

  export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended);
  ```

### バックエンド

#### Kotlin 2.0.21

- **主な変更点**:
  - K2コンパイラがデフォルト
  - コンパイル速度の向上
  - より良い型推論

#### Ktor 3.3.0

- **主な変更点**:
  - Kotlin 2.0必須
  - 新しいContent Negotiation API
  - パフォーマンスの改善

- **設定更新**:
  ```kotlin
  install(ContentNegotiation) {
      json(Json {
          encodeDefaults = true
          explicitNulls = false  // Null値を省略
      })
  }
  ```

#### kotlinx-coroutines 1.8.1

- **主な変更点**:
  - Kotlin 2.0完全対応
  - 新しいFlow API

#### kotlinx-serialization 1.7.3

- **主な変更点**:
  - より良いJSON処理
  - パフォーマンスの最適化

### ビルドツール

#### Turborepo 2.3.3

- **主な変更点**:
  - より高速なキャッシング
  - 改善されたログ出力
  - 新しいタスク依存関係システム

#### pnpm 9.15.0

- **主な変更点**:
  - より厳格な依存関係管理
  - パフォーマンスの改善

## 破壊的変更

### React 19

1. **レガシーAPIの削除**:
   - `defaultProps`（関数コンポーネント）
   - `propTypes`（ランタイムチェック）
   - 古いContext API

2. **推奨される移行**:
   - デフォルトpropsは通常のデフォルト引数を使用
   - PropTypesの代わりにTypeScriptを使用

### ESLint 9

1. **フラットコンフィグ必須**:
   - `.eslintrc.js`は非推奨
   - `eslint.config.mjs`を使用

2. **プラグインのインポート方法変更**:

   ```javascript
   // 旧方式（非推奨）
   extends: ['plugin:react/recommended']

   // 新方式
   import react from 'eslint-plugin-react'
   export default [...react.configs.recommended]
   ```

## 互換性マトリックス

| パッケージ | バージョン | 最小Node | 最小TypeScript |
| ---------- | ---------- | -------- | -------------- |
| React      | 19.2.0     | 18.0.0   | 5.0.0          |
| Vite       | 6.0.5      | 20.0.0   | 5.0.0          |
| Ktor       | 3.3.0      | -        | -              |
| Kotlin     | 2.0.21     | -        | -              |
| TypeScript | 5.7.2      | 18.0.0   | -              |

## インストール手順

### 1. 依存関係の更新

```bash
# pnpmのバージョンを更新
corepack prepare pnpm@9.15.0 --activate

# 依存関係をインストール
pnpm install

# キャッシュをクリア
pnpm store prune
```

### 2. Gradleビルド

```bash
cd apps/service-inventory
./gradlew clean build
```

### 3. 開発サーバー起動

```bash
# Turborepoで全体を起動
pnpm dev

# または個別に起動
cd apps/admin-panel
pnpm dev
```

## トラブルシューティング

### React型エラー

```typescript
// エラー: Property 'children' does not exist
// 解決: @types/react@19.0.0を使用

// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ES2023", "DOM", "DOM.Iterable"]
  }
}
```

### ESLintエラー

```bash
# エラー: Invalid configuration object
# 解決: eslint.config.mjsを使用

# 古い.eslintrc.*ファイルを削除
rm .eslintrc.js .eslintrc.json
```

### Ktorコンパイルエラー

```kotlin
// エラー: Unresolved reference
// 解決: Kotlin 2.0.21を使用

// build.gradle.kts
kotlin {
    jvmToolchain(17)  // JDK 17以上が必要
}
```

## 推奨される次のステップ

1. **React Compilerの検討**:

   ```bash
   pnpm add -D babel-plugin-react-compiler
   ```

2. **Biomeへの移行検討**:
   - ESLint + Prettierの代替として高速
   - Rustベースの実装

3. **Ktor 4.0の準備**:
   - 次期メジャーバージョンのロードマップを確認
   - 非推奨APIの使用状況を確認

## 参考リンク

- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Vite 6 Migration Guide](https://vite.dev/guide/migration)
- [Ktor 3.3 Changelog](https://ktor.io/changelog/)
- [Kotlin 2.0 Release](https://kotlinlang.org/docs/whatsnew20.html)
- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
