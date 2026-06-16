-- ============================================================================
-- 移行状況の確認と告知対象抽出用クエリ集
--
-- Supabase Dashboard > SQL Editor で必要なものを実行してください。
-- データを変更するクエリは含まれていません(SELECT のみ)。
-- ============================================================================

-- 1. 移行状況のサマリー --------------------------------------------------------
select
  count(*)                                                          as total,
  count(*) filter (where enc_salt is not null
                     and dek_wrapped_pass is not null)              as fully_migrated,
  count(*) filter (where enc_salt is not null
                     and dek_wrapped_pass is null)                  as old_encrypted,
  count(*) filter (where enc_salt is null)                          as not_migrated
from public.profiles;

-- 2. 未移行ユーザーのメール一覧(告知対象) -----------------------------------
-- enc_salt が NULL = MigrationGate をまだ通過していない
select
  email,
  coalesce(student_id, split_part(email, '@', 1))  as student_id_or_handle,
  created_at
from public.profiles
where enc_salt is null
order by created_at;

-- 3. 旧暗号化スキーム残存ユーザー(リカバリーコード未設定) ------------------
-- enc_salt はあるが dek_wrapped_pass が NULL = 旧 KEK==DEK 方式のまま
-- 次回ログインで自動的に新方式に上がる(unlock 内の legacy fallback)
select
  email,
  coalesce(student_id, split_part(email, '@', 1))  as student_id_or_handle,
  created_at
from public.profiles
where enc_salt is not null
  and dek_wrapped_pass is null
order by created_at;

-- 4. 全未対応ユーザー(2 + 3 を統合した告知対象) -----------------------------
select
  email,
  case
    when enc_salt is null then 'プロフィール暗号化なし'
    else 'リカバリーコード未設定'
  end as status,
  created_at
from public.profiles
where enc_salt is null
   or dek_wrapped_pass is null
order by status, created_at;

-- 5. BCC 送信用にメールアドレスをカンマ区切りで吐き出す --------------------
-- 結果セル(1行)をそのままコピーして Gmail の BCC 欄に貼り付け可能
select string_agg(email, ', ')
from public.profiles
where enc_salt is null
   or dek_wrapped_pass is null;
