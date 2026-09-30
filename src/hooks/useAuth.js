import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import {
  deriveKEK,
  generateSalt,
  generateDEK,
  wrapDEK,
  unwrapDEK,
  encryptJSON,
  decryptJSON,
  generateRecoveryCode,
  normalizeRecoveryCode,
  toBytes,
  toBytea,
} from '../lib/crypto.js'
import {
  recoverWithCode as recoverWithCodeLib,
  migrateLegacy as migrateLegacyLib,
  purgeLegacyCredits,
  purgeLegacyProfileFields,
} from '../lib/migrateLegacy.js'
import { cacheDEK, restoreDEK, clearCachedDEK } from '../lib/dekCache.js'

// 学番メール形式: 7桁数字 + 小文字1文字 + @stu.kobe-u.ac.jp
export const STUDENT_EMAIL_RE = /^\d{7}[a-z]@stu\.kobe-u\.ac\.jp$/

/**
 * 暗号化対応版の useAuth (リカバリーコード対応)
 *
 * 主要な追加 API:
 *   recoverWithCode(code, newPassphrase) - リカバリーコードでDEKを取り戻し、新パスフレーズに再設定
 *   pendingRecoveryCode                  - 直近のセットアップ/移行/再設定で発行された
 *                                          リカバリーコード(1度だけ表示用)
 *   clearPendingRecoveryCode()           - ユーザーが確認したらクリア
 */
export function useAuth() {
  const [session,    setSession]    = useState(null)
  const [profile,    setProfile]    = useState(null)
  const [rawProfile, setRawProfile] = useState(null)
  const [cryptoKey,  setCryptoKey]  = useState(null) // DEK
  const [loading,    setLoading]    = useState(true)
  const [pendingRecoveryCode, setPendingRecoveryCode] = useState(null)

  // セッション監視
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s) {
        fetchProfile(s.user.id)
      } else {
        setProfile(null)
        setRawProfile(null)
        setCryptoKey(null)
        setPendingRecoveryCode(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, admission_year, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc')
      .eq('id', userId)
      .maybeSingle()
    if (!error) {
      setRawProfile(data)
      if (data?.email) localStorage.setItem('portal:saved_email', data.email)

      // 端末キャッシュから DEK を復元できれば、パスフレーズ入力なしで解錠
      if (data?.enc_salt && data?.student_no_enc && data?.name_enc) {
        try {
          const dek = await restoreDEK(userId)
          if (dek) {
            const studentId = await decryptJSON(dek, toBytes(data.student_no_enc))
            const name      = await decryptJSON(dek, toBytes(data.name_enc))
            setCryptoKey(dek)
            setProfile({
              id: data.id,
              email: data.email,
              admission_year: data.admission_year,
              student_id: studentId,
              name,
            })
          }
        } catch {
          // キャッシュが壊れている等 → 通常の解錠フローへ
          clearCachedDEK(userId)
        }
      }
    }
    setLoading(false)
  }

  async function signIn(email) {
    if (!STUDENT_EMAIL_RE.test(email)) {
      throw new Error('学番メール (例: 226r001a@stu.kobe-u.ac.jp) のみ使用できます')
    }
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { shouldCreateUser: true },
    })
    if (error) throw error
  }

  async function verifyCode(email, code) {
    if (!STUDENT_EMAIL_RE.test(email)) {
      throw new Error('学番メール (例: 226r001a@stu.kobe-u.ac.jp) のみ使用できます')
    }
    const token = String(code).trim().replace(/\s+/g, '')
    if (!/^\d{6}$/.test(token)) {
      throw new Error('確認コードは6桁の数字で入力してください')
    }
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (error) throw error
    return data
  }

  async function signOut() {
    const userId = session?.user?.id
    setCryptoKey(null)
    setProfile(null)
    setRawProfile(null)
    setPendingRecoveryCode(null)
    if (userId) clearCachedDEK(userId)
    await supabase.auth.signOut()
  }

  /**
   * 初回プロフィール作成。DEKを生成し、パスフレーズKEKとリカバリーコードKEKで二重ラップする。
   * @returns {Promise<{recoveryCode: string}>}
   */
  async function createProfile(name, passphrase) {
    if (!session) throw new Error('未ログインです')
    if (!passphrase || passphrase.length < 10) {
      throw new Error('パスフレーズは10文字以上で入力してください')
    }
    const user = session.user
    const studentId = user.email.split('@')[0].toUpperCase()

    const dek = await generateDEK()
    const recoveryCode = generateRecoveryCode()
    const enc_salt = generateSalt()
    const rec_salt = generateSalt()

    const kek_p = await deriveKEK(passphrase, enc_salt)
    // リカバリーコードは正規化(区切り除去)してから鍵派生する。
    // 表示はハイフン付き、鍵素材はハイフン無しで統一し、解錠時の食い違いを防ぐ。
    const kek_r = await deriveKEK(normalizeRecoveryCode(recoveryCode), rec_salt)

    const [wrapP, wrapR, studentNoEnc, nameEnc] = await Promise.all([
      wrapDEK(dek, kek_p),
      wrapDEK(dek, kek_r),
      encryptJSON(dek, studentId),
      encryptJSON(dek, name),
    ])

    await supabase.auth.updateUser({ data: { full_name: name } })

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        enc_salt: toBytea(enc_salt),
        rec_salt: toBytea(rec_salt),
        dek_wrapped_pass: toBytea(wrapP),
        dek_wrapped_rec: toBytea(wrapR),
        student_no_enc: toBytea(studentNoEnc),
        name_enc: toBytea(nameEnc),
      })
      .select('id, email, admission_year, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc')
      .single()
    if (error) throw error

    setCryptoKey(dek)
    setRawProfile(data)
    setProfile({
      id: data.id,
      email: data.email,
      admission_year: data.admission_year,
      student_id: studentId,
      name,
    })
    setPendingRecoveryCode(recoveryCode)
    localStorage.setItem('portal:saved_email', data.email)
    await cacheDEK(data.id, dek)
    return { recoveryCode }
  }

  /**
   * 解錠。新スキーム(dek_wrapped_pass あり)とレガシースキーム(KEK==DEK)の両方に対応。
   * @param {string} passphrase
   */
  async function unlock(passphrase) {
    if (!session) throw new Error('未ログインです')
    const { data: fresh, error } = await supabase
      .from('profiles')
      .select('id, email, admission_year, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc')
      .eq('id', session.user.id)
      .single()
    if (error) throw error
    if (!fresh?.enc_salt) {
      throw new Error('暗号化されたプロフィールがありません。先に移行が必要です')
    }
    // enc_salt だけあってペイロードが無い(パスフレーズ導入前に開設され、
    // 暗号化が未確定のまま残った)アカウントは、レガシー復号に入っても
    // 必ず失敗する。誤解を招く「パスフレーズが正しくありません」ではなく、
    // 移行が必要である旨を明示して MigrationGate 側へ誘導する。
    const hasUsableVault =
      !!fresh.dek_wrapped_pass ||
      (!!fresh.student_no_enc && !!fresh.name_enc)
    if (!hasUsableVault) {
      throw new Error('このアカウントはパスフレーズが未設定です。設定画面から登録してください')
    }

    const kek_p = await deriveKEK(passphrase, toBytes(fresh.enc_salt))

    let dek, studentId, name
    if (fresh.dek_wrapped_pass) {
      // 新スキーム
      try {
        dek = await unwrapDEK(toBytes(fresh.dek_wrapped_pass), kek_p)
      } catch {
        throw new Error('パスフレーズが正しくありません')
      }
      studentId = await decryptJSON(dek, toBytes(fresh.student_no_enc))
      name      = await decryptJSON(dek, toBytes(fresh.name_enc))
    } else {
      // レガシースキーム: KEK で直接データを暗号化していた
      try {
        studentId = await decryptJSON(kek_p, toBytes(fresh.student_no_enc))
        name      = await decryptJSON(kek_p, toBytes(fresh.name_enc))
      } catch {
        throw new Error('パスフレーズが正しくありません')
      }
      dek = kek_p
      // レガシーユーザーには「リカバリーコードを発行してください」と促すバナー方針(別途)
    }

    setRawProfile(fresh)
    setCryptoKey(dek)
    setProfile({
      id: fresh.id,
      email: fresh.email,
      admission_year: fresh.admission_year,
      student_id: studentId,
      name,
    })
    await cacheDEK(fresh.id, dek)
  }

  /**
   * リカバリーコードでデータを取り戻し、新しいパスフレーズに再設定する。
   * 新しいリカバリーコードも自動発行される。
   *
   * @param {string} recoveryCode
   * @param {string} newPassphrase
   */
  async function recoverWithCode(recoveryCode, newPassphrase) {
    if (!session) throw new Error('未ログインです')
    const { studentId, name, newRecoveryCode, dek } = await recoverWithCodeLib({
      recoveryCode, newPassphrase,
    })
    // 最新の profile を取り直す
    const { data: fresh } = await supabase
      .from('profiles')
      .select('id, email, admission_year, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc')
      .eq('id', session.user.id)
      .single()
    setRawProfile(fresh)
    setCryptoKey(dek)
    setProfile({
      id: fresh.id,
      email: fresh.email,
      admission_year: fresh.admission_year,
      student_id: studentId,
      name,
    })
    setPendingRecoveryCode(newRecoveryCode)
    await cacheDEK(fresh.id, dek)
  }

  function clearPendingRecoveryCode() {
    setPendingRecoveryCode(null)
  }

  /**
   * 旧スキームから二重ラップ方式へ移送し、解錠まで進める。
   * 完了後 pendingRecoveryCode が設定されるので、呼び出し側は
   * RecoveryCodeReveal を経由してから次へ進めること。
   *
   * @param {string} passphrase
   * @param {object} [opts]
   * @param {boolean} [opts.purge=true] - 旧 user_credits / 平文 profile を削除するか
   */
  async function migrate(passphrase, { purge = true } = {}) {
    if (!session) throw new Error('未ログインです')
    const result = await migrateLegacyLib({ passphrase })
    if (purge) {
      try {
        await purgeLegacyCredits()
        await purgeLegacyProfileFields()
      } catch {
        // 削除失敗は致命的ではない(暗号化は済んでいる)
      }
    }
    await unlock(passphrase)
    if (result.recoveryCode) setPendingRecoveryCode(result.recoveryCode)
    return result
  }

  /**
   * メモリから DEK を破棄し、端末キャッシュも消す(=次回はパスフレーズが必要)。
   * 自動ロックタイムアウトや明示的なロック操作から呼ばれる。
   */
  function lock() {
    const userId = session?.user?.id
    setCryptoKey(null)
    setProfile(null)
    setPendingRecoveryCode(null)
    if (userId) clearCachedDEK(userId)
  }

  const updateAdmissionYear = useCallback(async (year) => {
    if (!session) throw new Error('未ログインです')
    const { data, error } = await supabase
      .from('profiles')
      .update({ admission_year: year })
      .eq('id', session.user.id)
      .select('id, email, admission_year, enc_salt, rec_salt, dek_wrapped_pass, dek_wrapped_rec, student_no_enc, name_enc')
      .single()
    if (error) throw error
    setRawProfile(data)
    setProfile((prev) => prev ? { ...prev, admission_year: year } : prev)
  }, [session])

  // 状態フラグ
  //
  // ゲート分岐は enc_salt の有無ではなく「実際に復号できる金庫があるか」で判定する。
  // 暗号化は運用途中で後付けされたため、パスフレーズ導入前に開設されたアカウントには
  // enc_salt だけが付与され、パスフレーズ(と暗号化ペイロード)が未確定のまま
  // 残っているものがある。それらを enc_salt だけで locked 扱いにすると、使える
  // パスフレーズが無いのに UnlockGate へ送られ、MigrationGate にも戻れず詰む。
  //
  // 復号可能な金庫の条件は fetchProfile の自動解錠ガードと揃える:
  //   - 二重ラップ方式: dek_wrapped_pass がある
  //   - レガシー暗号化方式: student_no_enc と name_enc が揃っている
  const hasUsableVault =
    !!rawProfile?.dek_wrapped_pass ||
    (!!rawProfile?.student_no_enc && !!rawProfile?.name_enc)

  const keyless        = !!session && !rawProfile && !loading
  const locked         = !!session && !!rawProfile && !cryptoKey &&  hasUsableVault
  // enc_salt が中途半端に残っているだけのレガシーアカウントもここに含め、
  // MigrationGate でパスフレーズを(再)設定できるようにする。
  const needsMigration = !!session && !!rawProfile && !cryptoKey && !hasUsableVault
  // レガシー暗号化ユーザー(リカバリーコード未設定): unlock 後にバナーを出すために使う
  const hasRecoveryCode = !!rawProfile?.dek_wrapped_rec

  return {
    session,
    profile,
    cryptoKey,
    rawProfile,
    loading,
    keyless,
    needsMigration,
    locked,
    hasRecoveryCode,
    pendingRecoveryCode,
    clearPendingRecoveryCode,
    signIn,
    verifyCode,
    signOut,
    createProfile,
    unlock,
    migrate,
    recoverWithCode,
    lock,
    updateAdmissionYear,
  }
}
