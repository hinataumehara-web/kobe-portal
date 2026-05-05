# 神戸大学食料環境経済学コース ポータル MCP App

Claude Desktop / Claude.ai のチャット内に、学生ポータルの UI をそのまま表示する **MCP App** です。

## 何をするものか

Claude に話しかけるだけで、以下の3つのツールが使えます。

| ツール | 概要 |
|---|---|
| `search-courses` | 科目マスタを検索。科目名・担当教員・シラバス・カテゴリ・必修/選択などで絞り込み |
| `list-course-info` | 先輩学生が投稿した授業攻略情報（難易度・テスト傾向）を一覧表示 |
| `list-past-exams` | 共有された過去問のメタ情報を一覧表示 |

ツールを呼び出すとチャット内に React UI がレンダリングされ、画面上のフィルタで絞り込みを続けられます。

## 想定ユーザー・業務シナリオ

- 「ミクロ経済学ってどの先生が担当してる？」→ `search-courses query="ミクロ経済学"`
- 「楽単を教えて」→ `list-course-info difficulty="楽単"`
- 「食料経済学の過去問ある？」→ `list-past-exams course_name="食料経済学"`

## アーキテクチャ

```
Claude Desktop (host)
        │  MCP stdio
        ▼
┌─ mcp-app/dist/server/server/index.js ────────────────┐
│  McpServer (MCP SDK)                                  │
│  ├── registerAppResource  ui://kobe-portal/mcp-app.html │
│  ├── registerAppTool  search-courses    ──→ courses.js│
│  ├── registerAppTool  list-course-info ──→ Supabase   │
│  └── registerAppTool  list-past-exams  ──→ Supabase   │
└───────────────────────────────────────────────────────┘
        │  structuredContent (Payload)
        ▼
┌─ mcp-app/dist/ui/mcp-app.html (single-file React) ───┐
│  App.tsx                                              │
│  ├── CourseList     ← kind: "course-list"             │
│  ├── CourseInfoList ← kind: "course-info-list"        │
│  └── PastExamList   ← kind: "past-exam-list"          │
└───────────────────────────────────────────────────────┘
```

- `search-courses` は Supabase を使わず、ポータル本体の `src/data/courses.js` を実行時にロードします
- `list-course-info` / `list-past-exams` は Supabase Anon Key で `course_info` / `past_exams` テーブルを読みます（Row Level Security は全件 select を許可していることが前提）

## セットアップ手順

### 1. 依存インストール・ビルド

```bash
cd mcp-app
npm install
npm run build
```

ビルド成果物:
- `dist/ui/mcp-app.html` — React UI（単一 HTML）
- `dist/server/server/index.js` — MCP サーバー

### 2. 環境変数の設定

ポータル本体の `.env` に設定されている Supabase の値を使います。

| MCP App の変数名 | ポータル本体の変数名 | 内容 |
|---|---|---|
| `SUPABASE_URL` | `VITE_SUPABASE_URL` | Supabase プロジェクト URL |
| `SUPABASE_ANON_KEY` | `VITE_SUPABASE_ANON_KEY` | Anon（公開）キー |

> `VITE_` プレフィックスは Vite 専用のため、MCP サーバー（Node.js）では別名が必要です。

### 3. Claude Desktop への登録

`~/Library/Application Support/Claude/claude_desktop_config.json` を編集してください。

```json
{
  "mcpServers": {
    "kobe-portal": {
      "command": "node",
      "args": [
        "/絶対パス/kobe potal/mcp-app/dist/server/server/index.js",
        "--stdio"
      ],
      "env": {
        "SUPABASE_URL": "https://xxxxxxxxxxxx.supabase.co",
        "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

> **パスのスペースに注意**: `kobe potal` にスペースが含まれるため、引用符で囲むか、シンボリックリンクを使ってください。

設定後 Claude Desktop を再起動すると、ツールが使えるようになります。

## 提供ツール一覧

### `search-courses`

科目マスタ（`src/data/courses.js`）を検索します。Supabase は不要。

**入力**

| パラメータ | 型 | 説明 |
|---|---|---|
| `query` | string? | 科目名・担当教員・シラバスのキーワード |
| `category` | string? | 分類名（例: `共通専門基礎科目`） |
| `subcategory` | string? | `必修` / `選択` / `自由` |
| `limit` | number? | 最大件数（デフォルト 50） |

**出力** (`structuredContent`)

```json
{
  "kind": "course-list",
  "courses": [...],
  "total": 12,
  "filter": { "query": "ミクロ" },
  "categories": ["共通専門基礎科目", ...],
  "subcategories": ["必修", "選択", "自由"]
}
```

---

### `list-course-info`

Supabase の `course_info` テーブルを読みます。

**入力**

| パラメータ | 型 | 説明 |
|---|---|---|
| `course_id` | string? | 科目ID（例: `CPB001`） |
| `difficulty` | `楽単`/`普通`/`難`? | 難易度フィルタ |
| `limit` | number? | 最大件数（デフォルト 30） |

---

### `list-past-exams`

Supabase の `past_exams` テーブルを読みます（ファイル DL は行いません）。

**入力**

| パラメータ | 型 | 説明 |
|---|---|---|
| `course_id` | string? | 科目ID |
| `course_name` | string? | 科目名の部分一致 |
| `year` | number? | 試験実施年度 |
| `limit` | number? | 最大件数（デフォルト 30） |

## 設計意図

- **読み取り専用**: Claude からの書き込みは実装しない。成績入力・過去問アップロードはブラウザのポータルで行う
- **Supabase Anon Key のみ**: 認証が必要な `user_credits` はスコープ外（RLS で保護済み）
- **静的データは runtime import**: `courses.js` はポータル本体のファイルをそのまま読み込み、データ重複を避ける
- **独立した npm プロジェクト**: ポータル本体のコードを一切変更しない

## 開発・拡張ガイド

```bash
npm run dev        # UI と サーバーを watch モードで並行ビルド
npm run typecheck  # 型検査（UI + サーバー両方）
npm run lint       # ESLint
npm run build      # 本番ビルド
```

### 新しいツールを追加するとき

1. `src/shared/types.ts` に `Payload` の union 型を追加
2. `src/server/index.ts` に `registerAppTool` を追加
3. `src/ui/App.tsx` の `View` 型と `applyPayload` に case を追加
4. `src/ui/components/` に対応コンポーネントを追加
