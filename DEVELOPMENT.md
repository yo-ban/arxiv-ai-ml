# 開発者向けドキュメント

## アーキテクチャ

### サイト構成

```
/                                    # トップページ（最新トレンド）
/archive/                           # アーカイブ一覧
/trends/2025-06-27/                 # 日付別ページ
/trends/2025-06-27/repo-name/       # リポジトリ詳細ページ
/feed.xml                           # RSS/Atomフィード
```

### データフロー

```
[外部サーバー]
    ↓ トレンド取得・解析
    ↓ analysis_YYYY-MM-DD/ を生成
    ↓ 
[GitHub - このリポジトリ]
    ↓ data/analysis_YYYY-MM-DD/ に配置
    ↓ GitHub Actions トリガー
    ↓ 
[11ty ビルド]
    ↓ Markdown → JSON データ変換
    ↓ テンプレート + データ → HTML生成
    ↓ 
[GitHub Pages]
    公開サイト
```

## データ形式

### 入力データ（data/analysis_YYYY-MM-DD/）

詳細フォーマット（新）: analyze_github_repos.mdを参照

主要セクション:
- **基本情報**: リポジトリ名、言語、スター数、フォーク数、ライセンス等
- **概要**: 一言で言うと、詳細説明、主な特徴
- **インストール・セットアップ**: 前提条件、インストール手順、基本的な使い方
- **技術スタック**: コア技術、開発ツール
- **プロジェクト構造**: ディレクトリ構成、主要ファイル解説
- **アーキテクチャ詳細**: 設計パターン、データフロー、コンポーネント関係
- **APIリファレンス**: 主要なAPI/メソッド、設定オプション
- **使用例・サンプルコード**: 基本例、応用例
- **ドキュメント**: 公式ドキュメント、チュートリアル
- **コミュニティ・エコシステム**: 関連プロジェクト、プラグイン
- **パフォーマンス・制限事項**: 性能、既知の制限
- **開発状況**: 最近の更新、ロードマップ
- **なぜトレンドになっているか**: 技術的革新性、コミュニティの反応
- **まとめ**: 向いている用途、代替案、総評

### 生成される中間データ（src/_data/trends.json）

```json
{
  "latestDate": "2025-06-27",
  "latestTrends": [
    {
      "rank": 1,
      "name": "owner/repo-name",
      "slug": "repo-name",
      "stars": 15234,
      "language": "TypeScript",
      "summary": "Brief description..."
    }
  ],
  "recentDates": ["2025-06-27", "2025-06-26", ...]
}
```

## 11ty の設定

### テンプレート階層

```
_includes/
├── layouts/
│   ├── base.njk     # 基本レイアウト（全ページ共通）
│   ├── date.njk     # 日付別ページ用
│   └── repo.njk     # リポジトリ詳細用
└── components/
    ├── header.njk   # ヘッダー
    ├── footer.njk   # フッター
    └── repo-card.njk # リポジトリカード
```

### カスタムフィルター

- `dateFormat`: 日付を YYYY-MM-DD 形式に変換
- `slugify`: URLセーフな文字列に変換
- `numberFormat`: 数値をカンマ区切りに

## データ処理の詳細

### generate-site-data.js の処理フロー

1. `data/analysis_*` ディレクトリをスキャン
2. 各 `repo_*.md` ファイルを解析
3. 日付別のページデータを生成（`src/trends/YYYY-MM-DD/index.md`）
4. リポジトリ詳細ページを生成（`src/trends/YYYY-MM-DD/repo-name/index.md`）
5. グローバルデータを生成（`src/_data/trends.json`）

## スタイリング

### CSS 変数

```css
:root {
    --black: #000000;
    --white: #ffffff;
    --gray-dark: #1a1a1a;
    --gray-medium: #666666;
    --gray-light: #e5e5e5;
    --gray-lighter: #f5f5f5;
}
```

### レスポンシブブレークポイント

- モバイル: < 768px
- タブレット: 768px - 1024px  
- デスクトップ: > 1024px

## 拡張方法

### 新しいページタイプの追加

1. `src/_includes/layouts/` に新しいレイアウトを作成
2. `scripts/generate-site-data.js` でページ生成ロジックを追加
3. 必要に応じて `.eleventy.js` にコレクションを追加

### 新しいデータソースの追加

1. `data/` に新しいディレクトリ構造を定義
2. `scripts/generate-site-data.js` で解析ロジックを実装
3. テンプレートでデータを参照

## デバッグ

### ビルドの詳細ログ

```bash
DEBUG=Eleventy* npm run build
```

### データ生成の確認

```bash
node scripts/generate-site-data.js
# src/trends/ と src/_data/trends.json を確認
```

### ローカルでGitHub Actions環境を再現

```bash
act -j build
```