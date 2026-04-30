import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * 履修データの取得・更新を管理する hook
 *
 * 返り値:
 *   credits      - user_credits レコード配列
 *   loading      - 取得中フラグ
 *   updateGrade  - 成績を upsert する関数
 */
export function useCredits(userId) {
  const [credits, setCredits]   = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchCredits = useCallback(async () => {
    if (!userId) {
      setCredits([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)

    if (!error && data) setCredits(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  /**
   * マスタ登録科目の成績を upsert する
   * @param {string} courseId - Course.id
   * @param {string} grade    - 秀|優|良|可|不可|未履修
   * @param {object} extra    - acad_year, semester など追加フィールド
   */
  async function updateGrade(courseId, grade, extra = {}) {
    if (!userId) return

    const record = {
      user_id: userId,
      course_id: courseId,
      grade,
      updated_at: new Date().toISOString(),
      completed_at:
        grade !== '未履修' && grade !== '不可'
          ? new Date().toISOString()
          : null,
      ...extra,
    }

    // ローカル state で既存レコードを確認し、INSERT / UPDATE を切り替える。
    // supabase upsert の onConflict は部分インデックスに非対応のためこの方式を使う。
    const existing = credits.find((c) => c.course_id === courseId)

    let data, error
    if (existing) {
      ;({ data, error } = await supabase
        .from('user_credits')
        .update(record)
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select()
        .single())
    } else {
      ;({ data, error } = await supabase
        .from('user_credits')
        .insert(record)
        .select()
        .single())
    }

    if (error) throw error

    // ローカル state も即時反映
    setCredits((prev) => {
      const exists = prev.find((c) => c.course_id === courseId)
      return exists
        ? prev.map((c) => (c.course_id === courseId ? data : c))
        : [...prev, data]
    })
  }

  /**
   * 自由入力科目を upsert する
   */
  async function updateCustomCredit(id, fields) {
    if (!userId) return

    if (id) {
      // 更新
      const { data, error } = await supabase
        .from('user_credits')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      setCredits((prev) => prev.map((c) => (c.id === id ? data : c)))
    } else {
      // 新規
      const { data, error } = await supabase
        .from('user_credits')
        .insert({ user_id: userId, ...fields })
        .select()
        .single()

      if (error) throw error
      setCredits((prev) => [...prev, data])
    }
  }

  return { credits, loading, updateGrade, updateCustomCredit, refetch: fetchCredits }
}
