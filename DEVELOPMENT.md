# 開発者向けドキュメント

## アーキテクチャ

### サイト構成

```
/                                    # トップページ（最新の論文一覧）
/archive/                           # 過去の論文アーカイブ
/papers/{paper-id}/                 # 論文詳細ページ
```

### データフロー

```
[外部サーバー]
    ↓ arXiv論文の選択・解析
    ↓ analysis_*.md を生成
    ↓ 
[GitHub - このリポジトリ]
    ↓ data/arxiv_papers_YYYY-MM-DD/ に配置
    ↓ GitHub Actions トリガー
    ↓ 
[11ty ビルド]
    ↓ Markdown → ページデータ変換
    ↓ テンプレート + データ → HTML生成
    ↓ 
[GitHub Pages]
    公開サイト
```

## データ形式

### 入力データ（data/arxiv_papers_YYYY-MM-DD/）

#### papers_to_analyze.json
選択された論文のメタデータ：
```json
[
  {
    "id": "2507.01945v1",
    "base_id": "2507.01945",
    "tex_source_url": "https://arxiv.org/src/2507.01945",
    "title": "LongAnimation: Long Animation Generation...",
    "categories": ["cs.CV", "cs.GR"],
    "selection_reason": "動的グローバル・ローカルメモリによる..."
  }
]
```

#### analysis_*.md
各論文の詳細解析結果：
- **基本情報**: arXiv ID、著者、所属、投稿日、カテゴリ
- **簡単に説明すると**: 一般向けの分かりやすい説明
- **研究概要**: 背景と動機、主要な貢献
- **提案手法**: 手法の概要、技術的詳細、新規性
- **実験結果**: 実験設定、主要な結果、既存手法との比較
- **実用性評価**: 実装の容易性、計算効率、応用可能性
- **まとめと所感**: 論文の意義、今後の展望

### 生成される中間データ（src/_data/papers.json）

```json
{
  "papers": [
    {
      "id": "2507.01945v1",
      "arxivId": "2507.01945v1",
      "arxivUrl": "https://arxiv.org/abs/2507.01945v1",
      "title": "LongAnimation: Long Animation Generation...",
      "authors": "Nan Chen, Mengqi Huang, ...",
      "categories": ["cs.CV", "cs.GR"],
      "summary": "この論文は、長期アニメーション...",
      "selectionReason": "動的グローバル・ローカルメモリ...",
      "date": "2025-07-04"
    }
  ],
  "totalCount": 12,
  "categoryStats": {
    "cs.CV": 5,
    "cs.LG": 4,
    "cs.AI": 3
  },
  "lastUpdated": "2025-07-04T12:00:00.000Z"
}
```

## 11ty の設定

### テンプレート階層

```
_includes/
├── layouts/
│   ├── base.njk     # 基本レイアウト（全ページ共通）
│   └── paper.njk    # 論文詳細ページ用
└── components/
    ├── header.njk   # ヘッダー
    ├── footer.njk   # フッター
    └── paper-card.njk # 論文カード
```

### ページ生成

- `index.njk`: トップページ（最新6件の論文）
- `archive.njk`: アーカイブページ（全論文一覧、ページネーション付き）
- `papers/{paper-id}/index.md`: 各論文の詳細ページ

## データ処理の詳細

### generate-site-data.js の処理フロー

1. `data/arxiv_papers_*` ディレクトリをスキャン
2. 各 `analysis_*.md` ファイルを解析
3. `papers_to_analyze.json` からメタデータを読み込み
4. ファイル名とメタデータのID形式の違いを自動調整
5. 論文詳細ページを生成（`src/papers/{paper-id}/index.md`）
6. グローバルデータを生成（`src/_data/papers.json`）

### ID形式の自動調整

ファイル名とメタデータでバージョン番号の有無が異なる場合に対応：
- ファイル名: `analysis_2507.01945.md` (バージョンなし)
- メタデータ: `2507.01945v1` (バージョンあり)

## スタイリング

### CSS 変数

```css
:root {
    --color-primary: #2563eb;
    --color-secondary: #64748b;
    --color-background: #ffffff;
    --color-surface: #f8fafc;
    --color-border: #e2e8f0;
    --color-text: #1e293b;
    --color-text-secondary: #64748b;
}
```

### レスポンシブデザイン

- モバイル: < 768px
- タブレット: 768px - 1024px  
- デスクトップ: > 1024px

## 拡張方法

### 新しいカテゴリの追加

1. 論文解析時にカテゴリを含める
2. `paper-card.njk` でカテゴリ表示を更新
3. 必要に応じてカテゴリ別フィルタを実装

### 検索機能の追加

1. `src/_data/papers.json` を検索インデックスとして使用
2. クライアントサイドJavaScriptで検索を実装
3. または、Algolia等の検索サービスと連携

## デバッグ

### ビルドの詳細ログ

```bash
DEBUG=Eleventy* npm run build
```

### データ生成の確認

```bash
node scripts/generate-site-data.js
# src/papers/ と src/_data/papers.json を確認
```

### ローカル開発

```bash
npm run dev
# http://localhost:8080 で確認
```

## 既知の問題と対処法

### ファイル名とIDの不一致

`generate-site-data.js` が自動的に以下を処理：
- バージョン番号の有無の違い
- base_idを使用した照合
- メタデータのIDを優先使用

### 複数行の著者情報

Markdownファイルで著者が複数行にわたる場合も正しく抽出

### エラーハンドリング

- 各論文のページ生成でエラーが発生しても処理を継続
- エラー詳細をコンソールに出力