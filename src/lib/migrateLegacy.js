import { supabase } from './supabase.js'
import {
  deriveKEK,
  generateSalt,
  generateDEK,
  wrapDEK,
  unwrapDEK,
  generateRecoveryCode,
  normalizeRecoveryCode,
  encryptJSON,
  decryptJSON,
  toBytes,
  toBytea,
} from './crypto.js'

/**
 * 旧 user_credits / 平文 profiles から、二重ラップ DEK 方式の
 * user_credits_enc / profiles 暗号化カラムへ移送する。
 *
 * 戻り値の recoveryCode は呼び出し側で必ず一度だけ画面表示すること
 * (ローカルにもサーバーにも平文では保存されない)。
 *
 * @param {object} args
 * @param {string} args.passphrase
 * @returns {Promise<{
 *   profileMigrated: boolean,
 *   creditsMigrated: number,
 *   skippedDuplicates: number,
 *   recoveryCode: string | null,  // 新規生成された場合のみ
 * }>}
 */
export async function migrateLegacy({ passphrase }) {
  if (!passphrase || passphrase.length < 10) {
    throw new Error('パスフレーズは10文字以上にしてください')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('ログインしていません')

  // クリーンアップ後は student_id / name 平文カラムが消えているので
  // 動的にカラム存在を試す。失敗したら暗号化カラムだけ select する。
  let prof
  {
    const r = await supabase
      .from('profiles')
      .select('id, email, student_id, name, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc, admission_year')
      .eq('id', user.id)
      .single()
    if (r.error && /column .* does not exist/i.test(r.error.message ?? '')) {
      const r2 = await supabase
        .from('profiles')
        .select('id, email, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc, admission_year')
        .eq('id', user.id)
        .single()
      if (r2.error) throw r2.error
      prof = r2.data
    } else if (r.error) {
      throw r.error
    } else {
      prof = r.data
    }
  }
  if (!prof) throw new Error('プロフィールが存在しません')

  let dek, kek_p, recoveryCode = null, profileMigrated = false

  if (prof.dek_wrapped_pass) {
    // 既に二重ラップ方式 → 鍵を取り出すだけ
    kek_p = await deriveKEK(passphrase, toBytes(prof.enc_salt))
    try {
      dek = await unwrapDEK(toBytes(prof.dek_wrapped_pass), kek_p)
    } catch {
      throw new Error('パスフレーズが既存の暗号化データと一致しません')
    }
  } else {
    // 二重ラップ方式へ移行(新規 or レガシー暗号化済み or 完全平文)
    dek = await generateDEK()
    recoveryCode = generateRecoveryCode()

    const enc_salt = prof.enc_salt ? toBytes(prof.enc_salt) : generateSalt()
    const rec_salt = generateSalt()

    kek_p = await deriveKEK(passphrase, enc_salt)
    const kek_r = await deriveKEK(recoveryCode, rec_salt)

    const [wrapP, wrapR, studentNoEnc, nameEnc] = await Promise.all([
      wrapDEK(dek, kek_p),
      wrapDEK(dek, kek_r),
      encryptJSON(dek, prof.student_id ?? user.email.split('@')[0].toUpperCase()),
      encryptJSON(dek, prof.name ?? ''),
    ])

    const { error: upErr } = await supabase
      .from('profiles')
      .update({
        enc_salt: toBytea(enc_salt),
        rec_salt: toBytea(rec_salt),
        dek_wrapped_pass: toBytea(wrapP),
        dek_wrapped_rec: toBytea(wrapR),
        student_no_enc: toBytea(studentNoEnc),
        name_enc: toBytea(nameEnc),
      })
      .eq('id', user.id)
    if (upErr) throw upErr
    profileMigrated = true
  }

  // 旧 user_credits 取得 → 暗号化版に移送
  // クリーンアップ後はテーブル自体が無いので、その場合は空配列扱い。
  let legacy
  {
    const r = await supabase
      .from('user_credits')
      .select('course_id, shared_course_id, custom_name, custom_category, custom_credits, grade, acad_year, semester, completed_at')
      .eq('user_id', user.id)
    if (r.error) {
      if (/(does not exist|relation .* does not exist)/i.test(r.error.message ?? '') || r.error.code === '42P01') {
        legacy = []
      } else {
        throw r.error
      }
    } else {
      legacy = r.data
    }
  }

  // 既存の暗号化済み行を取得し、重複判定用キーを作る
  const { data: existingEnc } = await supabase
    .from('user_credits_enc')
    .select('id, payload_enc')
    .eq('user_id', user.id)

  const existingKeys = new Set()
  for (const row of existingEnc ?? []) {
    try {
      const p = await decryptJSON(dek, toBytes(row.payload_enc))
      existingKeys.add(rowKey(p))
    } catch { /* 鍵が違う行は無視 */ }
  }

  let creditsMigrated = 0, skippedDuplicates = 0
  for (const row of legacy ?? []) {
    const k = rowKey(row)
    if (existingKeys.has(k)) { skippedDuplicates++; continue }
    const payload_enc = await encryptJSON(dek, row)
    const { error } = await supabase
      .from('user_credits_enc')
      .insert({ user_id: user.id, payload_enc: toBytea(payload_enc) })
    if (error) throw error
    creditsMigrated++
  }

  return { profileMigrated, creditsMigrated, skippedDuplicates, recoveryCode }
}

/**
 * 旧 user_credits を全削除する。
 * クリーンアップ後はテーブルが無いので silent に成功扱い。
 */
export async function purgeLegacyCredits() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('ログインしていません')
  const { error, count } = await supabase
    .from('user_credits')
    .delete({ count: 'exact' })
    .eq('user_id', user.id)
  if (error) {
    if (/(does not exist|relation .* does not exist)/i.test(error.message ?? '') || error.code === '42P01') {
      return { deleted: 0 }
    }
    throw error
  }
  return { deleted: count ?? 0 }
}

/**
 * 旧 profiles.student_id / name の平文を消す。
 * クリーンアップ後はカラム自体が無いので silent に成功扱い。
 */
export async function purgeLegacyProfileFields() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('ログインしていません')
  const { error } = await supabase
    .from('profiles')
    .update({ student_id: null, name: null })
    .eq('id', user.id)
  if (error && !/column .* does not exist/i.test(error.message ?? '')) throw error
}

/* ---------- internal ---------- */

function rowKey(r) {
  return JSON.stringify([
    r.course_id ?? null,
    r.shared_course_id ?? null,
    r.custom_name ?? null,
    r.acad_year ?? null,
    r.semester ?? null,
  ])
}

/**
 * リカバリーコードでデータを取り戻し、新しいパスフレーズに再設定する。
 *
 * @param {object} args
 * @param {string} args.recoveryCode  - 入力されたコード(区切り含む)
 * @param {string} args.newPassphrase
 * @returns {Promise<{
 *   studentId: string,
 *   name: string,
 *   newRecoveryCode: string,  // 旧コードは無効化、新しく発行する
 * }>}
 */
export async function recoverWithCode({ recoveryCode, newPassphrase }) {
  if (!newPassphrase || newPassphrase.length < 10) {
    throw new Error('新しいパスフレーズは10文字以上にしてください')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('ログインしていません')

  const { data: prof, error: profErr } = await supabase
    .from('profiles')
    .select('id, rec_salt, dek_wrapped_rec, student_no_enc, name_enc')
    .eq('id', user.id)
    .single()
  if (profErr) throw profErr
  if (!prof?.dek_wrapped_rec || !prof?.rec_salt) {
    throw new Error('このアカウントにはリカバリーコードが設定されていません')
  }

  const normalized = normalizeRecoveryCode(recoveryCode)
  if (normalized.length < 16) throw new Error('リカバリーコードの形式が正しくありません')

  const kek_r = await deriveKEK(normalized, toBytes(prof.rec_salt))

  let dek
  try {
    dek = await unwrapDEK(toBytes(prof.dek_wrapped_rec), kek_r)
  } catch {
    throw new Error('リカバリーコードが正しくありません')
  }

  // 新 salt + 新 KEK_p + 新リカバリーコード(旧コードを無効化)
  const new_enc_salt = generateSalt()
  const new_rec_salt = generateSalt()
  const newRecoveryCode = generateRecoveryCode()

  const kek_p_new = await deriveKEK(newPassphrase, new_enc_salt)
  const kek_r_new = await deriveKEK(newRecoveryCode, new_rec_salt)

  const [wrapP, wrapR] = await Promise.all([
    wrapDEK(dek, kek_p_new),
    wrapDEK(dek, kek_r_new),
  ])

  const { error: upErr } = await supabase
    .from('profiles')
    .update({
      enc_salt: toBytea(new_enc_salt),
      rec_salt: toBytea(new_rec_salt),
      dek_wrapped_pass: toBytea(wrapP),
      dek_wrapped_rec: toBytea(wrapR),
    })
    .eq('id', user.id)
  if (upErr) throw upErr

  const studentId = await decryptJSON(dek, toBytes(prof.student_no_enc))
  const name      = await decryptJSON(dek, toBytes(prof.name_enc))
  return { studentId, name, newRecoveryCode, dek }
}
