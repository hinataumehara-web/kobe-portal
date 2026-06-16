-- ============================================================================
-- 本番クリーンアップ: 旧平文データを完全削除する
--
-- 目的:
--   全ユーザーが暗号化方式へ移行完了したのを確認した後で、
--   旧 user_credits テーブルと profiles の平文カラムを物理削除する。
--
-- 前提:
--   - docs/supabase_schema.sql / supabase_schema_encrypted.sql /
--     supabase_schema_recovery.sql を順に適用済み
--   - 全ユーザーが MigrationGate を通過し、user_credits_enc にデータが移送済み
--
-- 安全弁:
--   未移行ユーザーが残っていた場合は RAISE EXCEPTION で中断するので、
--   そのままコピペ実行して問題ない。
--
-- 注意:
--   user_credits → user_credits_enc への移送は各ユーザーのブラウザでしか
--   できない(鍵が手元にしかないため)。CLI から一括移行はできない。
--   実行する前に、対象ユーザー全員がログインして移行を完了したことを必ず確認すること。
-- ============================================================================

-- 1. 未移行プロフィールがないか確認 -------------------------------------------
do $$
declare
  unmigrated_count int;
begin
  select count(*) into unmigrated_count
    from public.profiles
   where enc_salt is null or dek_wrapped_pass is null;

  if unmigrated_count > 0 then
    raise exception
      '未移行のユーザーが % 名います。全員の移行完了を確認してから再実行してください。',
      unmigrated_count;
  end if;
end $$;

-- 2. 平文の user_credits に残データがないか警告 -----------------------------
do $$
declare
  legacy_credit_count int;
begin
  select count(*) into legacy_credit_count from public.user_credits;
  if legacy_credit_count > 0 then
    raise warning
      '旧 user_credits に % 件の平文レコードが残っています。'
      '通常 MigrationGate で削除されるはずです。続行しますが手動で確認することを推奨します。',
      legacy_credit_count;
  end if;
end $$;

-- 3. 旧 user_credits テーブルを削除 -----------------------------------------
drop table if exists public.user_credits cascade;

-- 4. profiles から平文カラムを削除 ------------------------------------------
alter table public.profiles drop column if exists student_id;
alter table public.profiles drop column if exists name;

-- 5. 暗号化必須を制約として固定 ----------------------------------------------
alter table public.profiles alter column enc_salt         set not null;
alter table public.profiles alter column rec_salt         set not null;
alter table public.profiles alter column dek_wrapped_pass set not null;
alter table public.profiles alter column dek_wrapped_rec  set not null;
alter table public.profiles alter column student_no_enc   set not null;
alter table public.profiles alter column name_enc         set not null;

-- 6. 完了ログ --------------------------------------------------------------
do $$ begin
  raise notice '本番クリーンアップ完了: user_credits 削除, profiles 平文カラム削除, 暗号化カラム NOT NULL 化';
end $$;
