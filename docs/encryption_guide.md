# データ暗号化ガイド

学籍番号・氏名・履修科目・成績を、ブラウザで暗号化してから Supabase に送る仕組みのドキュメント。

## 全体像

```
┌───────────────┐       ┌──────────────────┐       ┌─────────────────┐
│ ユーザーの     │       │ ブラウザ          │       │ Supabase        │
│ パスフレーズ   │──────▶│ PBKDF2 で鍵派生   │──────▶│ bytea(暗号文)  │
│                │       │ AES-GCM で暗号化  │       │ のみ保存         │
└───────────────┘       └──────────────────┘       └─────────────────┘
```

- Supabase の DB には **暗号文と user_id しか残らない**
- 鍵はユーザーのパスフレーズからのみ派生でき、サーバーには送らない
- パスフレーズを忘れると復号不可 → リカバリーコード運用が必須(後述)

## ファイル構成

| ファイル | 役割 |
|---|---|
| `src/lib/crypto.js` | 鍵派生 / AES-GCM 暗号化・復号 / bytea 変換 |
| `src/lib/secureStore.js` | Supabase アクセス + 暗号化を統合した API |
| `src/hooks/useSecureCredits.js` | React hook ラッパー |
| `docs/supabase_schema_encrypted.sql` | 暗号化対応スキーマのマイグレーション |

## セットアップ手順

### 1. Supabase スキーマを適用

```bash
# Supabase Dashboard > SQL Editor で実行
docs/supabase_schema.sql           # 既存(未適用なら)
docs/supabase_schema_encrypted.sql # 今回追加
```

### 2. クライアント側の初回登録フロー

```jsx
// 例: 初回プロフィール作成画面
import { setupEncryption } from '@/lib/secureStore.js'

async function handleSubmit({ passphrase, studentNo, name }) {
  await setupEncryption({ passphrase, studentNo, name })
  // 以後はメモリに鍵がロード済み。履修登録などに進める
}
```

### 3. ログイン後のロック解除

```jsx
import { unlock } from '@/lib/secureStore.js'

async function handleUnlock(passphrase) {
  try {
    const { studentNo, name } = await unlock(passphrase)
    // 復号成功 → プロフィール表示など
  } catch (e) {
    alert('パスフレーズが違います')
  }
}
```

`unlock()` はパスフレーズで実際に復号を試みるため、誤入力時は例外を投げます。サーバー側にパスフレーズの正誤を判定する仕組みは不要(かつ作るべきでない)。

### 4. 履修データの読み書き

```jsx
import { useSecureCredits } from '@/hooks/useSecureCredits.js'

function CreditsPage({ userId }) {
  const { credits, loading, save, remove } = useSecureCredits(userId)

  if (loading) return <p>読み込み中…</p>

  return (
    <div>
      {credits.map((c) => (
        <div key={c.id}>
          {c.courseId} / {c.grade} / {c.year}年 {c.semester}
          <button onClick={() => remove(c.id)}>削除</button>
        </div>
      ))}
      <button onClick={() => save(null, {
        courseId: 'PC001', grade: '優', year: 2026, semester: '前期'
      })}>
        食料経済学を登録
      </button>
    </div>
  )
}
```

## 既存データからの移行

サーバー側で一括移行はできません(鍵がユーザーのブラウザにしかないため)。各ユーザーの初回ログイン時に以下を 1 度だけ実行する移行関数を用意してください:

```js
import { supabase } from '@/lib/supabase.js'
import { addCredit, setupEncryption } from '@/lib/secureStore.js'

async function migrateLegacyCredits({ passphrase, studentNo, name, userId }) {
  await setupEncryption({ passphrase, studentNo, name })

  const { data: legacy } = await supabase
    .from('user_credits')
    .select('course_id, shared_course_id, custom_name, custom_category, custom_credits, grade, acad_year, semester')
    .eq('user_id', userId)

  for (const row of legacy ?? []) {
    await addCredit({
      courseId: row.course_id,
      sharedCourseId: row.shared_course_id,
      customName: row.custom_name,
      customCategory: row.custom_category,
      customCredits: row.custom_credits,
      grade: row.grade,
      year: row.acad_year,
      semester: row.semester,
    })
  }

  // 全件移行できたら旧テーブルから削除(任意)
  // await supabase.from('user_credits').delete().eq('user_id', userId)
}
```

## リカバリーコード(推奨実装)

パスフレーズ忘れに備えて、初回セットアップ時にランダムなリカバリーコードを発行し、それでも鍵を復号できる二重ラップにします。

```
DEK   = ランダム32byte               # データ暗号鍵(これで履修データを暗号化)
KEK_p = PBKDF2(passphrase, salt_p)   # パスフレーズ由来の鍵
KEK_r = PBKDF2(recoveryCode, salt_r) # リカバリーコード由来の鍵

profiles.dek_by_pass = encrypt(DEK, KEK_p)
profiles.dek_by_rec  = encrypt(DEK, KEK_r)
```

通常時は KEK_p で DEK を復号 → DEK で履修を復号。パスフレーズ紛失時はリカバリーコードで KEK_r → DEK を取り出し → 新しいパスフレーズで再ラップ、という流れにします。

本ガイドのコアファイルは「パスフレーズ直接派生」のシンプル版です。リカバリーコードを実装する場合は `secureStore.js` を拡張してください。

## セキュリティ上の注意

- **localStorage / IndexedDB に鍵やパスフレーズを保存しない**。`secureStore.js` は鍵をモジュール内変数のみで保持しています
- **タブを閉じたらロック**。tab visibility や inactivity timer で `lock()` を呼ぶ実装を推奨
- **CSP を厳格に**。XSS を 1 つ刺されると鍵がメモリ上にいる間は復号できてしまいます
- **パスフレーズリセット = データ消失**。UI で必ず警告を出す
- **iv は毎回ランダム生成**。`crypto.js` は AES-GCM の仕様通り 12byte ランダム iv を毎回生成しています(同じ鍵で 2 回同じ iv を使うと壊滅的)

## 何が守られて何が守られないか

| 脅威 | 守られる? |
|---|---|
| DB ダンプの流出 | ◯ 暗号文のみで内容不明 |
| Supabase 管理者による閲覧 | ◯ 鍵を持たないため復号不可 |
| ネットワーク経由の傍受 | ◯ HTTPS + 暗号化済み |
| ユーザー端末のマルウェア | ✗ ブラウザメモリから鍵を抜かれる可能性 |
| XSS による不正実行 | △ ロック解除中なら復号可能 |
| パスフレーズの推測攻撃 | △ PBKDF2 200k 回でコスト増 + 強いパス必須 |
