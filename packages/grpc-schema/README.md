# gRPC Schema Package

このパッケージは、Protocol Buffersによるスキーマ定義を管理します。

## 📋 概要

- **Single Source of Truth**: フロントエンドとバックエンドの型定義を一元管理
- **型安全性**: 自動生成されたコードにより、コンパイル時に型エラーを検出
- **スキーマ駆動開発**: APIの仕様を先に定義し、実装はそれに従う

## 📂 ディレクトリ構造

```
grpc-schema/
├── proto/              # .protoファイル（スキーマ定義）
│   ├── catalog.proto   # 商品カタログサービス
│   └── common.proto    # 共通メッセージ定義
├── scripts/            # コード生成スクリプト
│   ├── generate-ts.js  # TypeScript生成
│   └── generate-kt.js  # Kotlin生成
└── generated/          # 自動生成されたコード（Git管理外）
    ├── ts/             # TypeScriptコード
    └── kotlin/         # Kotlinコード
```

## 🔧 セットアップ

### 前提条件

1. Protocol Buffers コンパイラ（protoc）のインストール

```bash
# Windows (Chocolatey)
choco install protoc

# macOS (Homebrew)
brew install protobuf

# Linux (apt)
sudo apt install protobuf-compiler
```

2. Node.js 依存関係のインストール

```bash
pnpm install
```

## 🚀 使い方

### コード生成

すべてのコードを生成:

```bash
pnpm proto:generate
```

TypeScriptのみ生成:

```bash
pnpm proto:generate:ts
```

Kotlinのみ生成:

```bash
pnpm proto:generate:kt
```

### スキーマの編集

1. `proto/` ディレクトリ内の `.proto` ファイルを編集
2. `pnpm proto:generate` を実行して生成
3. 生成されたコードをアプリケーションで使用

## 📚 Protocol Buffers の基礎

### メッセージ定義

```protobuf
message Product {
  string id = 1;          // フィールド番号は変更しない
  string name = 2;        // 新しいフィールドは末尾に追加
  int64 price = 3;
}
```

### サービス定義

```protobuf
service CatalogService {
  rpc GetProduct(GetProductRequest) returns (GetProductResponse);
}
```

### 型の対応表

| Proto型  | TypeScript型 | Kotlin型 |
| -------- | ------------ | -------- |
| string   | string       | String   |
| int32    | number       | Int      |
| int64    | bigint       | Long     |
| bool     | boolean      | Boolean  |
| repeated | Array<T>     | List<T>  |

## 🎓 学習リソース

- [Protocol Buffers 公式ドキュメント](https://protobuf.dev/)
- [gRPC 公式サイト](https://grpc.io/)
- [Buf - Protocol Buffers ツールチェーン](https://buf.build/)
