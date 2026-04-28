import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * Supabase Auth のセッション + profiles テーブルを管理する hook
 *
 * 返り値:
 *   session    - Supabase の Session オブジェクト(未ログイン時 null)
 *   profile    - profiles テーブルのレコード(未登録時 null)
 *   loading    - セッション確認中フラグ
 *   signIn(email)            - マジックリンク送信
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
   * マジックリンクをメールで送信する
   * @param {string} email - 学番メール
   */
  async function signIn(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // メール確認後にリダイレクトするURL(本番は Vercel のURLに変更)
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw error
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

  return { session, profile, loading, signIn, signOut, createProfile, updateAdmissionYear }
}
