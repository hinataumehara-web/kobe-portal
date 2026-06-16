-- ============================================================================
-- リカバリーコード対応マイグレーション
--
-- 目的:
--   暗号化方式を「KEK(パスフレーズ派生鍵)で直接データを暗号化」から
--   「ランダムなDEKでデータを暗号化し、DEKをパスフレーズKEKとリカバリーコードKEKで二重ラップ」に拡張。
--   パスフレーズ忘失時にリカバリーコードで救済できるようにする。
--
-- 前提:
--   docs/supabase_schema.sql と docs/supabase_schema_encrypted.sql を適用済み
--
-- カラム説明:
--   rec_salt          - リカバリーコード用 PBKDF2 salt (16 byte)
--   dek_wrapped_pass  - DEKをパスフレーズKEKでAES-GCM暗号化(iv含む)
--   dek_wrapped_rec   - DEKをリカバリーコードKEKでAES-GCM暗号化(iv含む)
--
-- 既存ユーザー(enc_salt あり、dek_wrapped_pass なし)はレガシースキーム扱い。
-- 各自の次回ログインや明示的なアップグレードで二重ラップ方式へ移行する。
-- ============================================================================

alter table public.profiles
  add column if not exists rec_salt          bytea,
  add column if not exists dek_wrapped_pass  bytea,
  add column if not exists dek_wrapped_rec   bytea;

comment on column public.profiles.rec_salt
  is 'リカバリーコード用 PBKDF2 salt';
comment on column public.profiles.dek_wrapped_pass
  is 'DEK を passphrase 由来 KEK で AES-GCM ラップしたバイト列(iv+ciphertext)';
comment on column public.profiles.dek_wrapped_rec
  is 'DEK を recovery code 由来 KEK で AES-GCM ラップしたバイト列(iv+ciphertext)';
