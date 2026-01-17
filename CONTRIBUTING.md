# Contributing Guide

このプロジェクトへの貢献に興味を持っていただきありがとうございます！

## 行動規範

このプロジェクトでは、すべての参加者に対して敬意を持って接することを期待しています。

## 貢献の方法

### バグ報告

バグを発見した場合は、以下の情報を含めてissueを作成してください：

- **環境情報**: OS、Node.jsバージョン、ブラウザなど
- **再現手順**: バグを再現できる詳細な手順
- **期待される動作**: 本来どのように動作すべきか
- **実際の動作**: 実際にどのように動作しているか
- **スクリーンショット**: 可能であれば添付

### 機能提案

新機能の提案は大歓迎です：

1. 既存のissueを確認して重複していないか確認
2. 提案の背景と目的を明確に説明
3. 可能であれば実装案を提示

### プルリクエスト

#### 開発フロー

```bash
# 1. リポジトリをフォーク

# 2. フォークをクローン
git clone https://github.com/YOUR_USERNAME/e-commerce.git
cd e-commerce

# 3. 依存関係をインストール
pnpm install

# 4. 機能ブランチを作成
git checkout -b feature/your-feature-name

# 5. 変更を加える
# コードを編集...

# 6. リントとフォーマットを実行
pnpm lint:fix
pnpm format

# 7. ビルドとテストを実行
pnpm build
pnpm test

# 8. コミット
git add .
git commit -m "feat: add your feature description"

# 9. プッシュ
git push origin feature/your-feature-name

# 10. プルリクエストを作成
```

#### コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメントのみの変更
- `style:` コードの動作に影響しない変更（フォーマットなど）
- `refactor:` リファクタリング
- `perf:` パフォーマンス改善
- `test:` テストの追加・修正
- `chore:` ビルドプロセスや補助ツールの変更

例：

```
feat: add product search functionality
fix: resolve pagination bug on product list page
docs: update API documentation for catalog service
```

#### コーディング規約

**TypeScript/React:**

- ESLint設定に従う
- Prettierでフォーマット
- 適切な型定義を使用
- JSDocコメントを追加

**Kotlin:**

- Kotlinの標準規約に従う
- 4スペースインデント
- KDocコメントを追加

#### プルリクエストのガイドライン

- 小さく、焦点を絞った変更にする
- 説明的なタイトルと詳細な説明を書く
- 関連するissueにリンクする
- スクリーンショットやGIFを含める（UI変更の場合）
- すべてのチェックが通ることを確認

### レビュープロセス

1. メンテナーがプルリクエストをレビュー
2. 必要に応じて修正を依頼
3. 承認後、メンテナーがマージ

## 開発環境のセットアップ

詳細は [DEVELOPMENT.md](docs/DEVELOPMENT.md) を参照してください。

### 必要な環境

- Node.js 20.11+
- pnpm 9.15+
- JDK 17+
- Docker & Docker Compose

### クイックスタート

```bash
# セットアップスクリプトを実行
make setup

# 開発サーバーを起動
make dev
```

## テスト

```bash
# 全体のテストを実行
pnpm test

# 特定のパッケージのみ
cd apps/admin-panel
pnpm test
```

## ドキュメント

コードの変更に伴い、ドキュメントも更新してください：

- README.md
- docs/ARCHITECTURE.md
- docs/DEVELOPMENT.md
- JSDoc/KDocコメント

## 質問やサポート

不明点がある場合は、遠慮なくissueで質問してください。

## ライセンス

貢献されたコードは、プロジェクトのライセンス（MIT）の下で公開されます。
