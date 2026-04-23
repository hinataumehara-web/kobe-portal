import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * 過去問データの取得・投稿を管理する hook
 */
export function usePastExams() {
  const [exams, setExams]     = useState([])
  const [loading, setLoading] = useState(true)

  const fetchExams = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('past_exams')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setExams(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  /**
   * 過去問を投稿する
   * @param {object} params
   * @param {string} params.courseId
   * @param {string} params.courseName
   * @param {number} params.year
   * @param {File|null} params.file
   * @param {string} params.comment
   * @param {boolean} params.isAnonymous
   * @param {object} params.profile - 投稿者プロフィール
   */
  async function uploadExam({ courseId, courseName, year, file, comment, isAnonymous, profile }) {
    let filePath = null
    let fileName = null

    // ファイルが選択されている場合は Storage にアップロード
    // ※ Storage バケット 'past-exams' は Supabase Dashboard で手動作成が必要
    if (file) {
      const ext = file.name.split('.').pop()
      fileName = file.name
      filePath = `${courseId}/${year}/${Date.now()}.${ext}`

      const { error: storageError } = await supabase.storage
        .from('past-exams')
        .upload(filePath, file)

      if (storageError) throw storageError
    }

    const { data, error } = await supabase
      .from('past_exams')
      .insert({
        course_id: courseId,
        course_name: courseName,
        year,
        file_path: filePath,
        file_name: fileName,
        comment: comment || null,
        is_anonymous: isAnonymous,
        uploaded_by: profile.id,
        uploader_name: isAnonymous ? null : profile.name,
      })
      .select()
      .single()

    if (error) throw error
    setExams((prev) => [data, ...prev])
    return data
  }

  /**
   * 署名付きダウンロードURLを取得する(60分有効)
   * @param {string} filePath
   */
  async function getDownloadUrl(filePath) {
    const { data, error } = await supabase.storage
      .from('past-exams')
      .createSignedUrl(filePath, 3600)

    if (error) throw error
    return data.signedUrl
  }

  /**
   * 自分の投稿を削除する
   * @param {string} examId
   * @param {string|null} filePath
   */
  async function deleteExam(examId, filePath) {
    if (filePath) {
      await supabase.storage.from('past-exams').remove([filePath])
    }
    const { error } = await supabase.from('past_exams').delete().eq('id', examId)
    if (error) throw error
    setExams((prev) => prev.filter((e) => e.id !== examId))
  }

  return { exams, loading, uploadExam, getDownloadUrl, deleteExam, refetch: fetchExams }
}
