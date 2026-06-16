# 暗号化移行ロールアウト手順

18名のユーザーを最新の暗号化方式に移行するためのオペレーション手順。

## 0. 前提

- アプリ側の MigrationGate / 自動ロック / 端末キャッシュ実装は本番反映済み
- `docs/supabase_schema.sql` `..._encrypted.sql` `..._recovery.sql` は適用済み
- `docs/supabase_schema_cleanup.sql` は **まだ実行しない**(全員移行後に実行)

## 1. 移行状況の現状把握

Supabase Dashboard → SQL Editor で
`docs/migration_admin_queries.sql` の **クエリ 1** を実行。

```
fully_migrated | old_encrypted | not_migrated
---------------+---------------+--------------
              ?|              ?|             ?
```

- `not_migrated`: MigrationGate もまだ通っていない人
- `old_encrypted`: 旧 KEK==DEK 方式の人。次回ログインで自動的に新方式に上がる
- `fully_migrated`: もう何もしなくて OK

`not_migrated + old_encrypted` の合計が **告知対象人数** です。

## 2. 告知メール送信

### 2-a. 宛先リスト取得

SQL Editor で **クエリ 5** を実行:

```sql
select string_agg(email, ', ')
from public.profiles
where enc_salt is null or dek_wrapped_pass is null;
```

結果セルの中身をコピー(カンマ区切りのメール一覧)。

### 2-b. Gmail で BCC 送信

1. Gmail で新規メールを開く
2. **宛先(To)** に自分のメール、**BCC** に上記コピーした文字列を貼り付け
3. 件名と本文は `docs/migration_email_template.md` からコピペ
4. ポータル URL を本文中の `(あなたのドメインを入れる)` 部分に差し替え
5. 送信

BCC にする理由: 受信者同士のメールアドレスが見えないようにするため(プライバシー)。

### 2-c. Slack/LINE で並行告知

オンラインの場(コース LINE グループ等)があれば、メールが埋もれることを考慮して、`migration_email_template.md` のカジュアル版を投げておくと反応率が上がります。

## 3. 進捗のモニタリング

数日おきに **クエリ 1** を再実行。`not_migrated + old_encrypted` が減っていくのを確認。

未対応が残るようなら、その人に個別 DM などでフォロー。

## 4. 全員移行完了後 → 本番クリーンアップ

`not_migrated = 0` かつ `old_encrypted = 0` を確認できたら、
`docs/supabase_schema_cleanup.sql` を SQL Editor で実行。

このスクリプトは「未移行が残っていたら例外を投げて止まる」安全弁付きなので、
誤って早く実行しても破壊的なことは起きません。

実行内容:

- 旧 `user_credits` テーブルを DROP
- `profiles.student_id` `profiles.name` を DROP
- 暗号化6カラムを NOT NULL 制約に固定(新規登録時の保険)

## 5. 完了後のチェック

- [ ] 自分のアカウントで再ログインしてポータルが正常表示される
- [ ] DevTools → Application → Storage で平文の氏名/学籍番号がどこにも見えない
- [ ] Supabase Dashboard で `profiles.student_id` `profiles.name` カラムが消えている
- [ ] Supabase Dashboard で `user_credits` テーブルが消えている

## FAQ(ユーザーから出そうな質問)

**Q: パスフレーズを忘れたら？**
リカバリーコードがあれば「パスフレーズを忘れた」リンクからリセットできます。両方なくすと履修データは取り戻せません。

**Q: 別のPCでも見られる？**
Supabase認証でログインすれば見られますが、初回はパスフレーズ入力が必要です。一度入れれば同じブラウザでは自動解錠。

**Q: パスフレーズの強度?**
10文字以上、英大小+数字混在を推奨。「強い」以上の判定でしか進めません。

**Q: 移行に時間はかかる?**
履修登録数にもよりますが、おおむね 5〜30 秒程度です。

**Q: データの暗号鍵を運営が握ってる?**
握っていません。鍵はあなたのブラウザだけにあります。サーバーにあるのは暗号文と「鍵を作るための塩(salt)」だけです。
