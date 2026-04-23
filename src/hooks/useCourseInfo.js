import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * 授業攻略情報の取得・投稿を管理する hook
 */
export function useCourseInfo() {
  const [courseInfos, setCourseInfos] = useState([])
  const [loading, setLoading]         = useState(true)

  const fetchCourseInfos = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('course_info')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setCourseInfos(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCourseInfos()
  }, [fetchCourseInfos])

  /**
   * 授業情報を投稿する
   * @param {object} fields
   * @param {object} profile - 投稿者プロフィール
   */
  async function submitCourseInfo(fields, profile) {
    const { data, error } = await supabase
      .from('course_info')
      .insert({
        ...fields,
        submitted_by:   profile.id,
        submitter_name: fields.isAnonymous ? null : profile.name,
        is_anonymous:   fields.isAnonymous,
      })
      .select()
      .single()

    if (error) throw error
    setCourseInfos((prev) => [data, ...prev])
    return data
  }

  /**
   * 自分の投稿を削除する
   */
  async function deleteCourseInfo(id) {
    const { error } = await supabase
      .from('course_info')
      .delete()
      .eq('id', id)

    if (error) throw error
    setCourseInfos((prev) => prev.filter((c) => c.id !== id))
  }

  return { courseInfos, loading, submitCourseInfo, deleteCourseInfo, refetch: fetchCourseInfos }
}
