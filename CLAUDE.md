# 神戸大学 食料環境経済学コース 学生ポータル

## プロジェクト概要

神戸大学 農学部 食料環境システム学科 食料環境経済学コース専用の学生ポータル。

- **フロントエンド**: React + Vite + Tailwind CSS + recharts + lucide-react
- **バックエンド(予定)**: Supabase(認証・DB・ファイルストレージ)
- **デプロイ先(予定)**: Vercel
- **想定ユーザー**: 食料環境経済学コースの学部生全員

## 現在のフェーズ

**フェーズ1: localStorage 版プロトタイプ**

- UI・機能の検証が目的
- データは localStorage に保存(同じブラウザでのみ復元)
- 科目データは `src/data/courses.js` に定数として保持

次フェーズで Supabase 連携を実装する。

## 卒業要件(合計126単位)

### 教養系(26単位)

| 分類 | 必要単位 |
|------|---------|
| 基礎教養科目 | 6 |
| 総合教養科目 | 6 |
| 外国語科目Ⅰ | 4 |
| 外国語科目Ⅱ | 4 |
| 情報科目 | 1 |
| 健康・スポーツ科学 | 1 |
| 高度教養科目(自コース指定) | 2 |
| 高度教養科目(その他) | 2 |

### 専門系(100単位)

| 分類 | 必要単位 |
|------|---------|
| 共通専門基礎科目 選択 | 16 |
| 専門科目 必修(48) | 48 |
| 専門科目 選択 | 26 |
| 専門科目 自由(農学部最大8 + 他学部最大2) | 10 |

### 専門科目「必修48」の内訳

- 学部共通科目 必修: 5(初年次セミナー1 + 食の倫理2 + 緑の保全2)
- 学科共通科目 必修: 16(食料環境システム学概論ⅠⅡⅢ各2 + 卒業研究10)
- コース開講科目 必修: 27(食料経済学2 + ミクロ経済学2 + マクロ経済学2 + ...)

## データ構造

### Course(科目)

`src/data/courses.js` を参照。フィールドは以下:

```js
{
  id: string,           // "PC001" など
  name: string,         // "食料経済学"
  credits: number,      // 単位数
  category: string,     // CATEGORIES の値
  subcategory: string,  // "必修" | "選択" | "自由"
  isFacultyDesignated: boolean,  // 学部指定科目(履修登録上限超過可)
  year: number | null,          // 開講学年
  semester: string | null,      // "前期" | "後期" | "通年"
  teacher: string | null,       // 担当教員
  syllabus: string | null,      // シラバス概要
  evaluation: string | null,    // 評価方法
  note: string | null,          // 備考
}
```

### UserCredit(ユーザー履修データ)

localStorage キー: `portal:credits:<学籍番号>`

```js
{
  courseId: string,      // Course.id と対応
  customName?: string,   // 自由入力の科目名(courseId がない場合)
  customCategory?: string,
  customCredits?: number,
  grade: "秀" | "優" | "良" | "可" | "不可" | "未履修",
  year: number,          // 履修年度(西暦)
  semester: string,      // "前期" | "後期" | "通年"
  completedAt?: string,  // ISO8601
}
```

## コーディングルール

### 必ず守ること

- **科目データを App.jsx に直書きしない**。必ず `src/data/courses.js` を参照する
- **分類名は文字列リテラルで書かない**。`CATEGORIES.PRO_COURSE` のように定数経由で参照する
- **成績の重みは定数として定義**する(秀=4, 優=3, 良=2, 可=1, 不可=0)
- **localStorage キーは `portal:` プレフィックス必須**、ユーザー固有データは学籍番号を含める
- **卒業要件の数字はハードコーディングしない**。`src/data/requirements.js` を参照する
- **自由科目の上限ルール**(農学部8単位 + 他学部2単位)を単位計算ロジックに必ず反映する
- **自由科目はユーザー自由入力方式**。courses.js に登録されていない科目でも、単位計算ツールで「科目名・カテゴリ(自由科目(農学部開講)or(他学部開講))・単位数・成績」を直接入力できるようにする。履修可能な科目のバリエーションが多すぎるため、マスタ登録は行わない
- **外国語Ⅱは1言語を選択**する方式。日本人学生は英語(外国語Ⅰ)4単位+第2外国語4単位が基本ルート。単位計算時は言語混在しないようUI側でガイドする

### 推奨

- コメントは日本語でOK
- Git コミットメッセージも日本語でOK
- コンポーネントは `src/components/` 以下に分割
- 単位計算ロジックは `src/lib/creditCalc.js` に切り出し

## データ追加の運用

### 新しい科目を追加するとき

1. `src/data/courses.js` の該当カテゴリのセクションに追加
2. id は既存の連番を継続(例: CPB018 の次は CPB019)
3. 卒業要件への影響がある場合は `src/data/requirements.js` も更新

### シラバス情報を追加するとき

方法A: CSV からの一括更新(推奨)
- `docs/courses_template.csv` を編集
- Claude Code に「courses_template.csv の内容を courses.js にマージして」と依頼

方法B: シラバスPDFからの自動抽出
- `docs/syllabus/` にPDFを配置
- Claude Code に「このPDFから XXX 科目の教員・学期情報を抽出して courses.js に反映して」と依頼

## よく使うコマンド

```bash
npm run dev      # 開発サーバー起動(localhost:5173)
npm run build    # 本番ビルド
npm run preview  # ビルド結果のローカル確認
```

## 過去問データの取り扱いに関する注意

過去問ファイルの公開・配布は著作権上の問題があり得るため、以下に留意:

- 学内限定の非公開運用でも事前に学務・担当教員に相談することが望ましい
- 問題そのものではなく「出題傾向のまとめ」「先輩の解答例」等に留める選択肢もある
- 技術的には Supabase Storage で管理する想定

## 参考資料の置き場所

- `docs/履修便覧_2026.pdf` - 履修便覧(卒業要件の根拠)
- `docs/syllabus/` - 科目ごとのシラバスPDF
- `docs/courses_template.csv` - 科目データ追加用CSVテンプレート
