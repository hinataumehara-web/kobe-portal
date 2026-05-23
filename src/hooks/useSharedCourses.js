import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * 全ユーザー共有の自由入力科目を管理する hook
 */
export function useSharedCourses() {
  const [sharedCourses, setSharedCourses] = useState([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    fetchSharedCourses()
  }, [])

  async function fetchSharedCourses() {
    setLoading(true)
    const { data, error } = await supabase
      .from('shared_courses')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setSharedCourses(data)
    setLoading(false)
  }

  /**
   * 新しい共有科目を追加する
   * @param {{ name: string, category: string, credits: number, creator_name: string }} fields
   * @returns {object} 追加されたレコード
   */
  async function addSharedCourse(fields) {
    const { data, error } = await supabase
      .from('shared_courses')
      .insert({ ...fields, created_by: (await supabase.auth.getUser()).data.user?.id })
      .select()
      .single()
    if (error) throw error
    setSharedCourses((prev) => [...prev, data])
    return data
  }

  /**
   * 共有科目を削除する(登録者のみ可、cascade で全ユーザーの成績も削除)
   */
  async function deleteSharedCourse(id) {
    const { error } = await supabase
      .from('shared_courses')
      .delete()
      .eq('id', id)
    if (error) throw error
    setSharedCourses((prev) => prev.filter((c) => c.id !== id))
  }

  return { sharedCourses, loading, addSharedCourse, deleteSharedCourse, refetch: fetchSharedCourses }
}
