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
  id             uuid references auth.users on delete cascade primary key,
  student_id     text not null unique,
  name           text not null,
  email          text not null unique,
  admission_year integer,   -- 入学年度: 2024以前=旧制度, 2025以降=新制度, null=未設定
  created_at     timestamptz default now()
);

-- 既存テーブルへのカラム追加(冪等)
alter table public.profiles add column if not exists admission_year integer;

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
  grade           text check (grade in ('秀','優','良','可','不可','未履修','合格','不合格'))
                       not null default '未履修',
  acad_year       integer,
  semester        text check (semester in ('前期','後期','通年')),
  completed_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.user_credits enable row level security;

-- grade の CHECK 制約を「合格/不合格」を許容するよう更新(冪等)
alter table public.user_credits
  drop constraint if exists user_credits_grade_check;
alter table public.user_credits
  add constraint user_credits_grade_check
  check (grade in ('秀','優','良','可','不可','未履修','合格','不合格'));

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
  curriculum    text default 'common' check (curriculum in ('old', '2025', 'common')),
  created_at    timestamptz default now()
);

-- 既存テーブルへのカラム追加(冪等)
alter table public.past_exams add column if not exists curriculum text default 'common'
  check (curriculum in ('old', '2025', 'common'));

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
-- 授業攻略情報
-- -------------------------------------------------------------------------
create table if not exists public.course_info (
  id             uuid default gen_random_uuid() primary key,
  course_id      text,              -- courses.js の Course.id (null = マスタ未登録)
  name           text not null,     -- 科目名
  schedule       text,              -- 曜日・時限
  difficulty     text check (difficulty in ('楽単','普通','難')) not null,
  tags           text[] default '{}',
  summary        text not null,     -- 一言まとめ
  detail         text not null,     -- 詳細な攻略情報
  exam_tips      text,              -- テスト対策(任意)
  submitted_by   uuid references public.profiles(id) on delete set null,
  submitter_name text,              -- 投稿者名(非正規化)
  is_anonymous   boolean default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.course_info enable row level security;

drop policy if exists "ログイン済みユーザーは授業情報を閲覧可" on public.course_info;
create policy "ログイン済みユーザーは授業情報を閲覧可"
  on public.course_info for select
  using (auth.role() = 'authenticated');

drop policy if exists "ログイン済みユーザーは授業情報を投稿可" on public.course_info;
create policy "ログイン済みユーザーは授業情報を投稿可"
  on public.course_info for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "自分の授業情報のみ削除可" on public.course_info;
create policy "自分の授業情報のみ削除可"
  on public.course_info for delete
  using (auth.uid() = submitted_by);

drop trigger if exists course_info_updated_at on public.course_info;
create trigger course_info_updated_at
  before update on public.course_info
  for each row execute function public.set_updated_at();

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

-- -------------------------------------------------------------------------
-- shared_courses テーブル(全ユーザー共有の自由入力科目)
-- -------------------------------------------------------------------------
create table if not exists public.shared_courses (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  category     text not null,
  credits      numeric not null check (credits > 0),
  created_by   uuid references public.profiles(id) on delete set null,
  creator_name text,
  created_at   timestamptz default now()
);

alter table public.shared_courses enable row level security;

drop policy if exists "ログイン済みユーザーは共有科目を閲覧可" on public.shared_courses;
create policy "ログイン済みユーザーは共有科目を閲覧可"
  on public.shared_courses for select
  using (auth.role() = 'authenticated');

drop policy if exists "ログイン済みユーザーは共有科目を追加可" on public.shared_courses;
create policy "ログイン済みユーザーは共有科目を追加可"
  on public.shared_courses for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "追加者のみ共有科目を削除可" on public.shared_courses;
create policy "追加者のみ共有科目を削除可"
  on public.shared_courses for delete
  using (auth.uid() = created_by);

-- -------------------------------------------------------------------------
-- user_credits に shared_course_id カラムを追加
-- -------------------------------------------------------------------------
alter table public.user_credits
  add column if not exists shared_course_id uuid references public.shared_courses(id) on delete cascade;

create unique index if not exists user_credits_shared_unique
  on public.user_credits(user_id, shared_course_id)
  where shared_course_id is not null;

-- ============================================================================
-- 学番メール以外のサインアップを禁止する Auth Hook
-- (Before User Created Hook)
--
-- 【目的】
--   クライアント側の正規表現チェックを迂回されても、サーバー側で
--   `7桁数字 + 小文字1文字 + @stu.kobe-u.ac.jp` 形式以外のメールアドレスでは
--   ユーザー作成 = 認証メール送信が起こらないようにする。
--
-- 【有効化手順】
--   1. この SQL を実行して関数を作成
--   2. Supabase Dashboard > Authentication > Hooks (Beta)
--      > "Before User Created" を有効化
--      > Hook type: Postgres
--      > Schema: public  /  Function: restrict_to_student_email
--      > Save
--
-- 【参考】 https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook
-- ============================================================================
create or replace function public.restrict_to_student_email(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  email_addr text;
begin
  -- イベントペイロードからメールアドレスを取り出す
  -- (キー名は Supabase の Auth Hook 仕様に従う)
  email_addr := lower(coalesce(
    event #>> '{user,email}',
    event #>> '{claims,email}',
    event ->> 'email'
  ));

  -- 学番メール形式チェック: 7桁数字 + 小文字1文字 + @stu.kobe-u.ac.jp
  if email_addr is null or email_addr !~ '^[0-9]{7}[a-z]@stu\.kobe-u\.ac\.jp$' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 400,
        'message',
        '神戸大学の学番メール (例: 226r001a@stu.kobe-u.ac.jp) のみ登録できます'
      )
    );
  end if;

  -- 通過 → 空の decision を返す
  return jsonb_build_object('decision', 'continue');
end;
$$;

-- Auth Hook 用のロール supabase_auth_admin に実行権限を付与
grant execute on function public.restrict_to_student_email(jsonb)
  to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;

-- ============================================================================
-- 【併せて Supabase Dashboard で行う設定】
--
-- ◆ メールテンプレートを「マジックリンク」→「6桁コード」に変更
--   Dashboard > Authentication > Email Templates > "Magic Link"
--   本文を以下のように {{ .Token }} を使ったテンプレートに書き換える:
--
--     <h2>確認コード: {{ .Token }}</h2>
--     <p>このコードをポータルの入力欄に貼り付けてログインを完了してください。</p>
--     <p>コードは 60 分間有効です。心当たりがなければこのメールは無視してください。</p>
--
--   ※ {{ .ConfirmationURL }} を残しておくとマジックリンクも併用可能。
--     コードのみ運用にする場合は削除してよい。
--
-- ◆ サインアップを制限する
--   Dashboard > Authentication > Providers > Email
--   "Confirm email" は ON、"Allow new users to sign up" は ON のまま
--   (Auth Hook 側で弾くため Allow signup は ON でよい)
-- ============================================================================

