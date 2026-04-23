-- ============================================================================
-- 神戸大学 食料環境経済学コース 学生ポータル
-- Supabase スキーマ定義
--
-- 【実行手順】
-- Supabase Dashboard > SQL Editor に以下を貼り付けて実行してください。
--
-- 【Storage バケットについて】
-- past-exams バケットは SQL では作成できません。
-- Supabase Dashboard > Storage > New bucket で手動作成してください。
--   バケット名: past-exams
--   Public: OFF (認証済みユーザーのみアクセス可)
-- ============================================================================

-- -------------------------------------------------------------------------
-- ユーザープロフィール
-- auth.users と 1:1 で対応。学籍番号・氏名を管理する。
-- -------------------------------------------------------------------------
create table public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  student_id text not null unique,   -- 学籍番号 (例: 226R001A)
  name       text not null,          -- 氏名
  email      text not null unique,   -- 学番メール
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "自分のプロフィールのみ参照・更新可"
  on public.profiles for all
  using (auth.uid() = id);

-- -------------------------------------------------------------------------
-- 履修・成績データ
-- -------------------------------------------------------------------------
create table public.user_credits (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  course_id       text,              -- courses.js の Course.id (null の場合は自由入力)
  custom_name     text,              -- 自由入力科目名
  custom_category text,              -- 自由科目のカテゴリ
  custom_credits  numeric,           -- 自由科目の単位数
  grade           text check (grade in ('秀','優','良','可','不可','未履修'))
                       not null default '未履修',
  acad_year       integer,           -- 履修年度 (西暦)
  semester        text check (semester in ('前期','後期','通年')),
  completed_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.user_credits enable row level security;

create policy "自分の履修データのみ操作可"
  on public.user_credits for all
  using (auth.uid() = user_id);

-- user_id + course_id で upsert できるよう unique インデックス
create unique index user_credits_unique
  on public.user_credits(user_id, course_id)
  where course_id is not null;

-- updated_at 自動更新トリガー
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_credits_updated_at
  before update on public.user_credits
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------------------
-- 過去問メタデータ
-- ファイル本体は Storage バケット past-exams に保存する。
-- -------------------------------------------------------------------------
create table public.past_exams (
  id            uuid default gen_random_uuid() primary key,
  course_id     text not null,         -- courses.js の Course.id
  course_name   text not null,         -- 表示用科目名 (非正規化)
  year          integer not null,      -- 実施年度
  file_path     text,                  -- Storage 内のパス (courseId/year/filename)
  file_name     text,                  -- 元のファイル名
  comment       text,                  -- 投稿者コメント
  is_anonymous  boolean default true,
  uploaded_by   uuid references public.profiles(id) on delete set null,
  uploader_name text,                  -- 非匿名の場合の投稿者名 (非正規化)
  created_at    timestamptz default now()
);

alter table public.past_exams enable row level security;

-- 閲覧: ログイン済みユーザー全員
create policy "ログイン済みユーザーは閲覧可"
  on public.past_exams for select
  using (auth.role() = 'authenticated');

-- 投稿: ログイン済みユーザー全員
create policy "ログイン済みユーザーは投稿可"
  on public.past_exams for insert
  with check (auth.role() = 'authenticated');

-- 削除: 自分の投稿のみ
create policy "自分の投稿のみ削除可"
  on public.past_exams for delete
  using (auth.uid() = uploaded_by);

-- ============================================================================
-- 【Storage バケット設定メモ】
-- Dashboard > Storage > New bucket
--   名前: past-exams
--   Public: OFF
-- Storage > Policies で以下を設定:
--   SELECT / INSERT / DELETE: authenticated ロールのみ許可
-- ============================================================================
