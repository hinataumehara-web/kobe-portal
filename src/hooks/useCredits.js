import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { encryptJSON, decryptJSON, toBytes } from '../lib/crypto.js'

/**
 * 暗号化対応版の useCredits
 *
 * 既存の CreditsPage との互換を保つため、返す credits[] の各要素は
 * 旧 user_credits テーブルと同じ snake_case フィールドを持つ:
 *   { id, course_id, shared_course_id, custom_name, custom_category,
 *     custom_credits, grade, acad_year, semester, completed_at }
 *
 * 内部的には user_credits_enc.payload_enc に上記オブジェクトを AES-GCM
 * 暗号化した JSON として保存している。
 *
 * @param {string|null} userId
 * @param {CryptoKey|null} cryptoKey  - useAuth() の cryptoKey をそのまま渡す
 */
export function useCredits(userId, cryptoKey) {
  const [credits, setCredits] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCredits = useCallback(async () => {
    if (!userId || !cryptoKey) {
      setCredits([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('user_credits_enc')
      .select('id, payload_enc')
      .eq('user_id', userId)

    if (error) {
      setLoading(false)
      throw error
    }

    const decoded = await Promise.all(
      (data ?? []).map(async (row) => {
        try {
          const payload = await decryptJSON(cryptoKey, toBytes(row.payload_enc))
          return { id: row.id, ...payload }
        } catch {
          // 鍵が違う行は無視(原理的には起こらないはず)
          return null
        }
      })
    )
    setCredits(decoded.filter(Boolean))
    setLoading(false)
  }, [userId, cryptoKey])

  useEffect(() => { fetchCredits() }, [fetchCredits])

  /** 暗号化して 1 行 insert / update */
  async function persist(id, payload) {
    const payload_enc = await encryptJSON(cryptoKey, payload)
    if (id) {
      const { error } = await supabase
        .from('user_credits_enc')
        .update({ payload_enc })
        .eq('id', id)
        .eq('user_id', userId)
      if (error) throw error
      return { id, ...payload }
    } else {
      const { data, error } = await supabase
        .from('user_credits_enc')
        .insert({ user_id: userId, payload_enc })
        .select('id')
        .single()
      if (error) throw error
      return { id: data.id, ...payload }
    }
  }

  /**
   * マスタ登録科目の成績を upsert する
   */
  async function updateGrade(courseId, grade, extra = {}) {
    if (!userId || !cryptoKey) return
    const completed_at =
      grade !== '未履修' && grade !== '不可' && grade !== '不合格'
        ? new Date().toISOString() : null

    const existing = credits.find((c) => c.course_id === courseId && !c.shared_course_id)
    const payload = {
      course_id: courseId,
      shared_course_id: null,
      custom_name: null,
      custom_category: null,
      custom_credits: null,
      ...existing,         // 既存の acad_year/semester などを温存
      grade,
      completed_at,
      ...extra,            // 上書き
    }
    delete payload.id

    const next = await persist(existing?.id ?? null, payload)
    setCredits((prev) => existing
      ? prev.map((c) => (c.id === existing.id ? next : c))
      : [...prev, next])
  }

  /**
   * 共有科目の成績を upsert する
   */
  async function updateSharedGrade(sharedCourseId, grade) {
    if (!userId || !cryptoKey) return
    const completed_at =
      grade !== '未履修' && grade !== '不可' && grade !== '不合格'
        ? new Date().toISOString() : null

    const existing = credits.find((c) => c.shared_course_id === sharedCourseId)
    const payload = {
      course_id: null,
      shared_course_id: sharedCourseId,
      custom_name: null,
      custom_category: null,
      custom_credits: null,
      ...existing,
      grade,
      completed_at,
    }
    delete payload.id

    const next = await persist(existing?.id ?? null, payload)
    setCredits((prev) => existing
      ? prev.map((c) => (c.id === existing.id ? next : c))
      : [...prev, next])
  }

  /**
   * 自由入力科目(course_id も shared_course_id もなし)を upsert
   */
  async function updateCustomCredit(id, fields) {
    if (!userId || !cryptoKey) return
    const existing = id ? credits.find((c) => c.id === id) : null
    const payload = {
      course_id: null,
      shared_course_id: null,
      ...existing,
      ...fields,
    }
    delete payload.id

    const next = await persist(id ?? null, payload)
    setCredits((prev) => existing
      ? prev.map((c) => (c.id === id ? next : c))
      : [...prev, next])
  }

  async function deleteCustomCredit(id) {
    if (!userId) return
    const { error } = await supabase
      .from('user_credits_enc')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
    setCredits((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    credits,
    loading,
    updateGrade,
    updateSharedGrade,
    updateCustomCredit,
    deleteCustomCredit,
    refetch: fetchCredits,
  }
}
