import { useState } from 'react'
import { courses } from '../../data/courses.js'

const CRIMSON = '#7a1e2f'
const CURRENT_YEAR = new Date().getFullYear()

/**
 * 過去問一覧・投稿ページ
 */
export default function PastExamsPage({ exams, loading, uploadExam, getDownloadUrl, deleteExam, profile, showToast }) {
  const [searchName,   setSearchName]   = useState('')
  const [filterYear,   setFilterYear]   = useState('')
  const [showModal,    setShowModal]    = useState(false)
  const [dlLoading,    setDlLoading]    = useState(null) // 署名URL取得中の exam.id

  // フィルタ
  const filtered = exams.filter((e) => {
    const nameMatch = !searchName || e.course_name.includes(searchName)
    const yearMatch = !filterYear || String(e.year) === filterYear
    return nameMatch && yearMatch
  })

  // 科目名でグループ化
  const grouped = filtered.reduce((acc, exam) => {
    if (!acc[exam.course_name]) acc[exam.course_name] = []
    acc[exam.course_name].push(exam)
    return acc
  }, {})

  async function handleDownload(exam) {
    if (!exam.file_path) return
    setDlLoading(exam.id)
    try {
      const url = await getDownloadUrl(exam.file_path)
      window.open(url, '_blank')
    } catch (err) {
      showToast('ダウンロードに失敗しました', 'error')
    } finally {
      setDlLoading(null)
    }
  }

  async function handleDelete(exam) {
    if (!confirm(`「${exam.course_name} ${exam.year}年度」の過去問を削除しますか?`)) return
    try {
      await deleteExam(exam.id, exam.file_path)
      showToast('削除しました', 'success')
    } catch (err) {
      showToast('削除に失敗しました', 'error')
    }
  }

  // 年度一覧(重複除去)
  const years = [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">過去問</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-white px-4 py-1.5 rounded-lg transition"
          style={{ backgroundColor: CRIMSON }}
        >
          + 投稿する
        </button>
      </div>

      {/* フィルタ */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="科目名で検索"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 w-48"
        />
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
        >
          <option value="">すべての年度</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}年度</option>
          ))}
        </select>
        <span className="self-center text-xs text-gray-400">{filtered.length} 件</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-red-800 rounded-full animate-spin" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          過去問がまだ投稿されていません
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([courseName, examList]) => (
            <div key={courseName} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700">
                {courseName}
              </div>
              <table className="w-full text-sm">
                <thead className="text-gray-500 text-xs border-b border-gray-100">
                  <tr>
                    <th className="text-center px-4 py-2 w-20">年度</th>
                    <th className="text-left px-4 py-2">コメント</th>
                    <th className="text-center px-4 py-2 hidden sm:table-cell">投稿者</th>
                    <th className="text-center px-4 py-2 w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {examList.map((exam) => (
                    <tr key={exam.id} className="border-t border-gray-50">
                      <td className="px-4 py-2 text-center text-gray-600">{exam.year}年度</td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{exam.comment ?? '—'}</td>
                      <td className="px-4 py-2 text-center text-xs text-gray-400 hidden sm:table-cell">
                        {exam.is_anonymous ? '匿名' : (exam.uploader_name ?? '—')}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {exam.file_path && (
                            <button
                              onClick={() => handleDownload(exam)}
                              disabled={dlLoading === exam.id}
                              className="text-xs underline disabled:opacity-50"
                              style={{ color: CRIMSON }}
                            >
                              {dlLoading === exam.id ? '…' : 'DL'}
                            </button>
                          )}
                          {/* 自分の投稿のみ削除可 */}
                          {exam.uploaded_by === profile?.id && (
                            <button
                              onClick={() => handleDelete(exam)}
                              className="text-xs text-gray-400 hover:text-red-600"
                            >
                              削除
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* 投稿モーダル */}
      {showModal && (
        <UploadModal
          profile={profile}
          onClose={() => setShowModal(false)}
          onSubmit={uploadExam}
          showToast={showToast}
        />
      )}
    </div>
  )
}

/** 過去問投稿モーダル */
function UploadModal({ profile, onClose, onSubmit, showToast }) {
  const [courseId,    setCourseId]    = useState('')
  const [year,        setYear]        = useState(String(CURRENT_YEAR))
  const [file,        setFile]        = useState(null)
  const [comment,     setComment]     = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [submitting,  setSubmitting]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!courseId) { showToast('科目を選択してください', 'error'); return }

    const course = courses.find((c) => c.id === courseId)
    setSubmitting(true)
    try {
      await onSubmit({
        courseId,
        courseName: course.name,
        year: parseInt(year, 10),
        file,
        comment,
        isAnonymous,
        profile,
      })
      showToast('投稿しました', 'success')
      onClose()
    } catch (err) {
      showToast('投稿に失敗しました: ' + (err.message || ''), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">過去問を投稿</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              <option value="">選択してください</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年度(西暦)</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max={CURRENT_YEAR}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ファイル <span className="text-gray-400 text-xs">(任意)</span>
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:text-white file:cursor-pointer"
              style={{ '--file-bg': CRIMSON }}
            />
            <p className="text-xs text-gray-400 mt-1">
              ※ Supabase Storage バケット「past-exams」が事前に作成されている必要があります
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              コメント <span className="text-gray-400 text-xs">(任意)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="記述式中心、持ち込み可、など"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">匿名で投稿する</span>
          </label>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm text-white rounded-lg transition disabled:opacity-50"
              style={{ backgroundColor: CRIMSON }}
            >
              {submitting ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
