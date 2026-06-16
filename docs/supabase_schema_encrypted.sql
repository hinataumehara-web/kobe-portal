-- ============================================================================
-- クライアントサイド暗号化対応マイグレーション
--
-- 目的:
--   学籍番号 / 氏名 / 履修科目 / 成績 を AES-GCM で暗号化してから保存する。
--   DB には bytea(暗号文) しか残らないため、Supabase 管理者にも内容が見えない。
--
-- 実行手順:
--   1. supabase_schema.sql を先に適用済みであること
--   2. 本ファイルを Supabase Dashboard > SQL Editor に貼り付けて Run
--   3. クライアント側で src/lib/secureStore.js の setupEncryption() を呼ぶ
--
-- 既存の profiles.student_id / name と user_credits は当面残置し、
-- 全ユーザーが暗号化版へ移行完了したら別マイグレーションで DROP する。
-- ============================================================================

-- -------------------------------------------------------------------------
-- profiles: 暗号化カラムと salt を追加
-- -------------------------------------------------------------------------
alter table public.profiles
  add column if not exists enc_salt        bytea,
  add column if not exists student_no_enc  bytea,
  add column if not exists name_enc        bytea,
  add column if not exists updated_at      timestamptz default now();

-- 既存の NOT NULL 制約は新規ユーザーが暗号化フローのみで完結できるよう緩める
alter table public.profiles alter column student_id drop not null;
alter table public.profiles alter column name       drop not null;

-- profiles 更新時に updated_at を自動更新
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- user_credits_enc: 履修1件 = 暗号化された JSON 1行
-- -------------------------------------------------------------------------
create table if not exists public.user_credits_enc (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  payload_enc  bytea not null,        -- {courseId, grade, year, semester, ...} を AES-GCM 暗号化
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.user_credits_enc enable row level security;

-- 自分の行だけ参照・更新・削除できる
drop policy if exists "自分の暗号化履修データのみ操作可" on public.user_credits_enc;
create policy "自分の暗号化履修データのみ操作可"
  on public.user_credits_enc for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 検索性は復号後にクライアント側で行うため、user_id にだけインデックスを張る
create index if not exists user_credits_enc_user_idx
  on public.user_credits_enc(user_id);

drop trigger if exists user_credits_enc_updated_at on public.user_credits_enc;
create trigger user_credits_enc_updated_at
  before update on public.user_credits_enc
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- profiles の RLS を念のため強化
-- (既存ポリシーは "自分のプロフィールのみ参照・更新可" で USING のみ。
--  暗号化カラムへの書き込みも本人のみに限定する)
-- -------------------------------------------------------------------------
drop policy if exists "自分のプロフィールのみ参照・更新可" on public.profiles;
create policy "自分のプロフィールのみ参照・更新可"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================================
-- 【移行ロールアウト案】
--
--  Phase A (本マイグレーション): 暗号化カラム・テーブルを追加。
--                                既存テーブルは触らない。
--  Phase B: アプリ側を secureStore.js 経由に切り替え。
--           初回ロード時にユーザーがパスフレーズを設定。
--  Phase C: 既存 user_credits からの移行スクリプトを各ユーザー個別に実行
--           (暗号化はクライアントでしかできないため、サーバー側で
--            バッチ移行はできない)。
--  Phase D: 全ユーザーが移行完了したら以下を実行:
--             alter table public.profiles drop column student_id;
--             alter table public.profiles drop column name;
--             drop table public.user_credits cascade;
-- ============================================================================
