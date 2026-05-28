import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

// 学番メール形式: 7桁数字 + 小文字1文字 + @stu.kobe-u.ac.jp
// 例: 226r001a@stu.kobe-u.ac.jp
export const STUDENT_EMAIL_RE = /^\d{7}[a-z]@stu\.kobe-u\.ac\.jp$/

/**
 * Supabase Auth のセッション + profiles テーブルを管理する hook
 *
 * 返り値:
 *   session    - Supabase の Session オブジェクト(未ログイン時 null)
 *   profile    - profiles テーブルのレコード(未登録時 null)
 *   loading    - セッション確認中フラグ
 *   signIn(email)            - 6桁の確認コードをメール送信
 *   verifyCode(email, code)  - 6桁の確認コードを検証してログイン完了
 *   signOut()                - ログアウト
 *   createProfile(name)      - 初回ログイン時にプロフィール作成
 */
export function useAuth() {
  const [session, setSession]   = useState(null)
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)

  // セッション監視
  useEffect(() => {
    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Auth 状態変化を購読
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (!error) {
      setProfile(data)
      // ログイン成功後にメールを保存(次回ワンクリックログイン用)
      if (data?.email) {
        localStorage.setItem('portal:saved_email', data.email)
      }
    }
    setLoading(false)
  }

  /**
   * 6桁の確認コードをメールで送信する
   *
   * クライアント側で学番メール形式をチェックし、形式が異なる場合は
   * Supabase API を呼ばずに即座にエラーにする。
   * (サーバー側でも Before User Created Auth Hook で再度弾く)
   *
   * @param {string} email - 学番メール
   */
  async function signIn(email) {
    // 学番メール形式チェック(クライアント側の一次フィルタ)
    if (!STUDENT_EMAIL_RE.test(email)) {
      throw new Error('学番メール (例: 226r001a@stu.kobe-u.ac.jp) のみ使用できます')
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // emailRedirectTo は指定しない。
        // メールテンプレートを {{ .Token }} (6桁コード) に設定することで
        // マジックリンクではなく確認コード方式になる。
        shouldCreateUser: true,
      },
    })
    if (error) throw error
  }

  /**
   * 6桁の確認コードを検証してログインを完了する
   *
   * @param {string} email - signIn で送信先に指定したメール
   * @param {string} code  - メールに記載されている6桁のコード
   */
  async function verifyCode(email, code) {
    if (!STUDENT_EMAIL_RE.test(email)) {
      throw new Error('学番メール (例: 226r001a@stu.kobe-u.ac.jp) のみ使用できます')
    }
    const token = String(code).trim().replace(/\s+/g, '')
    if (!/^\d{6}$/.test(token)) {
      throw new Error('確認コードは6桁の数字で入力してください')
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
    return data
  }

  /** ログアウト(saved_email は残す — 次回ワンクリックログインに使う) */
  async function signOut() {
    await supabase.auth.signOut()
  }

  /**
   * 初回ログイン時のプロフィール作成
   * @param {string} name - 氏名
   */
  async function createProfile(name) {
    if (!session) throw new Error('未ログインです')
    const user = session.user

    // 学籍番号をメールから抽出 (例: 226r001a@stu.kobe-u.ac.jp → 226r001a)
    const studentId = user.email.split('@')[0].toUpperCase()

    // Auth の user_metadata にも名前を保存(Supabase ダッシュボードの Display name に反映)
    await supabase.auth.updateUser({ data: { full_name: name } })

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        student_id: studentId,
        name,
        email: user.email,
      })
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    localStorage.setItem('portal:saved_email', data.email)
    return data
  }

  /**
   * 入学年度を更新する(入学年度選択モーダルから呼ばれる)
   * @param {number} year - 選択した入学年度(2024 or 2025)
   */
  async function updateAdmissionYear(year) {
    if (!session) throw new Error('未ログインです')
    const { data, error } = await supabase
      .from('profiles')
      .update({ admission_year: year })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) throw error
    setProfile(data)
  }

  return {
    session,
    profile,
    loading,
    signIn,
    verifyCode,
    signOut,
    createProfile,
    updateAdmissionYear,
  }
}
