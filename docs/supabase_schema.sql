-- ============================================================================
-- 神戸大学 食料環境経済学コース 学生ポータル
-- Supabase スキーマ定義(冪等版 — 何度実行しても安全)
--
-- 【実行手順】
-- Supabase Dashboard > SQL Editor に貼り付けて Run してください。
--
-- 【Storage バケットについて】
-- past-exams バケットは SQL では作成できません。
-- Supabase Dashboard > Storage > New bucket で手動作成してください。
--   バケット名: past-exams  /  Public: OFF
-- ============================================================================

-- -------------------------------------------------------------------------
-- profiles テーブル
-- -------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  student_id text not null unique,
  name       text not null,
  email      text not null unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "自分のプロフィールのみ参照・更新可" on public.profiles;
create policy "自分のプロフィールのみ参照・更新可"
  on public.profiles for all
  using (auth.uid() = id);

-- -------------------------------------------------------------------------
-- user_credits テーブル
-- -------------------------------------------------------------------------
create table if not exists public.user_credits (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  course_id       text,
  custom_name     text,
  custom_category text,
  custom_credits  numeric,
  grade           text check (grade in ('秀','優','良','可','不可','未履修'))
                       not null default '未履修',
  acad_year       integer,
  semester        text check (semester in ('前期','後期','通年')),
  completed_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.user_credits enable row level security;

drop policy if exists "自分の履修データのみ操作可" on public.user_credits;
create policy "自分の履修データのみ操作可"
  on public.user_credits for all
  using (auth.uid() = user_id);

create unique index if not exists user_credits_unique
  on public.user_credits(user_id, course_id)
  where course_id is not null;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_credits_updated_at on public.user_credits;
create trigger user_credits_updated_at
  before update on public.user_credits
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- past_exams テーブル
-- -------------------------------------------------------------------------
create table if not exists public.past_exams (
  id            uuid default gen_random_uuid() primary key,
  course_id     text not null,
  course_name   text not null,
  year          integer not null,
  file_path     text,
  file_name     text,
  comment       text,
  is_anonymous  boolean default true,
  uploaded_by   uuid references public.profiles(id) on delete set null,
  uploader_name text,
  created_at    timestamptz default now()
);

alter table public.past_exams enable row level security;

drop policy if exists "ログイン済みユーザーは閲覧可" on public.past_exams;
create policy "ログイン済みユーザーは閲覧可"
  on public.past_exams for select
  using (auth.role() = 'authenticated');

drop policy if exists "ログイン済みユーザーは投稿可" on public.past_exams;
create policy "ログイン済みユーザーは投稿可"
  on public.past_exams for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "自分の投稿のみ削除可" on public.past_exams;
create policy "自分の投稿のみ削除可"
  on public.past_exams for delete
  using (auth.uid() = uploaded_by);

-- -------------------------------------------------------------------------
-- Storage バケット past-exams の RLS ポリシー
-- ※ バケット自体は Dashboard > Storage > New bucket で手動作成してください
--   バケット名: past-exams / Public: OFF
-- 以下の SQL はバケット作成後に実行してください
-- -------------------------------------------------------------------------

-- 閲覧: ログイン済みユーザーのみ
drop policy if exists "authenticated users can read past-exams" on storage.objects;
create policy "authenticated users can read past-exams"
  on storage.objects for select
  using (
    bucket_id = 'past-exams'
    and auth.role() = 'authenticated'
  );

-- アップロード: ログイン済みユーザーのみ
drop policy if exists "authenticated users can upload past-exams" on storage.objects;
create policy "authenticated users can upload past-exams"
  on storage.objects for insert
  with check (
    bucket_id = 'past-exams'
    and auth.role() = 'authenticated'
  );

-- 削除: 自分がアップロードしたファイルのみ
drop policy if exists "owners can delete past-exams" on storage.objects;
create policy "owners can delete past-exams"
  on storage.objects for delete
  using (
    bucket_id = 'past-exams'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
