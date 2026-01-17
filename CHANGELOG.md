# Changelog

プロジェクトの重要な変更をこのファイルに記録します。

形式は [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づき、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に従います。

## [Unreleased]

### 追加

- 初期プロジェクト構造
- Turborepo モノレポ設定
- gRPC スキーマ定義（商品カタログ）
- 共有パッケージ（shared-utils, ui-core）
- 在庫サービス（Kotlin + Ktor + gRPC）
- 管理画面（React 19.2 + Vite 6 + Fluent UI v9）
- Docker Compose 環境（PostgreSQL, Redis, Envoy）
- ドキュメント（README, ARCHITECTURE, DEVELOPMENT）
- 環境変数テンプレート
- VS Code 設定とおすすめ拡張機能
- EditorConfig 設定
- Git属性設定
- Makefile（開発タスク自動化）
- CI/CD パイプライン（GitHub Actions）
- セキュリティポリシー
- コントリビューションガイド

### 変更

- React: 18.2 → 19.2
- Vite: 5.0 → 6.0
- Ktor: 2.3 → 3.3
- Kotlin: 1.9 → 2.0
- TypeScript: 5.3 → 5.7
- ESLint: 8.x → 9.x
- Turborepo: 1.x → 2.x
- pnpm: 8.x → 9.x

### 修正

- TypeScript型定義の改善
- ESLint設定をフラットコンフィグに移行
- Ktor 3.3 対応のJSON設定

## [1.0.0] - 2026-01-17

### 追加

- 初回リリース
- 基本的なE-Commerce機能（商品管理）
- マイクロサービスアーキテクチャ
- Clean Architecture実装
- gRPCベースの通信
- Fluent UI v9 ベースの管理画面

---

[Unreleased]: https://github.com/yourusername/e-commerce/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/e-commerce/releases/tag/v1.0.0
