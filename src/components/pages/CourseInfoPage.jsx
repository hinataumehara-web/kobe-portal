import { useState } from 'react'
import { courses } from '../../data/courses.js'

const DIFFICULTY_BADGE = {
  楽単: 'bg-green-100 text-green-700',
  普通: 'bg-yellow-100 text-yellow-700',
  難:   'bg-red-100   text-red-700',
}

const DIFFICULTIES = ['すべて', '楽単', '普通', '難']

/** 日付を「YYYY/MM/DD」形式でフォーマット */
function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 授業情報ページ
 */
export default function CourseInfoPage({ courseInfos, loading, submitCourseInfo, deleteCourseInfo, profile, onNavigateToExams, showToast }) {
  const [search,     setSearch]     = useState('')
  const [difficulty, setDifficulty] = useState('すべて')
  const [selected,   setSelected]   = useState(null)
  const [showAdd,    setShowAdd]    = useState(false)

  const filtered = courseInfos.filter((info) => {
    const nameMatch = !search || info.name.includes(search)
    const diffMatch = difficulty === 'すべて' || info.difficulty === difficulty
    return nameMatch && diffMatch
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-800">授業情報</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm text-white px-3 py-1.5 rounded-lg transition"
          style={{ backgroundColor: '#40916c' }}
        >
          + 情報を追加
        </button>
      </div>

      {/* 免責注記 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 mb-4">
        ※ これは先輩・仲間からの非公式な情報です。内容の正確性を保証するものではありません。
      </div>

      {/* 検索 + 難易度フィルタ */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="科目名で検索"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-44"
        />
        <div className="flex gap-1 flex-wrap">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                difficulty === d
                  ? 'bg-[#40916c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="self-center text-xs text-gray-400">{filtered.length} 件</span>
      </div>

      {/* ローディング */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-12 text-gray-400 text-sm">
          {courseInfos.length === 0 ? '授業情報がまだ投稿されていません' : '該当する科目がありません'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((info) => (
            <CourseInfoCard
              key={info.id}
              info={info}
              isOwn={info.submitted_by === profile?.id}
              onOpen={() => setSelected(info)}
              onDelete={async () => {
                if (!confirm('この授業情報を削除しますか?')) return
                try {
                  await deleteCourseInfo(info.id)
                  showToast('削除しました', 'success')
                } catch {
                  showToast('削除に失敗しました', 'error')
                }
              }}
            />
          ))}
        </div>
      )}

      {/* 詳細モーダル */}
      {selected && (
        <CourseInfoModal
          info={selected}
          onClose={() => setSelected(null)}
          onNavigateToExams={onNavigateToExams}
        />
      )}

      {/* 投稿モーダル */}
      {showAdd && (
        <AddCourseInfoModal
          profile={profile}
          onClose={() => setShowAdd(false)}
          onSubmit={submitCourseInfo}
          showToast={showToast}
        />
      )}
    </div>
  )
}

/** 科目カード */
function CourseInfoCard({ info, isOwn, onOpen, onDelete }) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-snug">{info.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{info.schedule}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${DIFFICULTY_BADGE[info.difficulty]}`}>
          {info.difficulty}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {(info.tags ?? []).map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">{info.summary}</p>

      {/* フッター: 投稿日・投稿者 */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {info.is_anonymous ? '匿名' : info.submitter_name ?? '匿名'} · {fmtDate(info.created_at)}
        </span>
        <div className="flex items-center gap-2">
          {isOwn && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="text-xs text-gray-300 hover:text-red-500 transition"
            >
              削除
            </button>
          )}
          <span className="text-xs font-medium text-green-700">詳細 →</span>
        </div>
      </div>
    </div>
  )
}

/** 詳細モーダル */
function CourseInfoModal({ info, onClose, onNavigateToExams }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-800">{info.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{info.schedule}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none shrink-0">
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_BADGE[info.difficulty]}`}>
              {info.difficulty}
            </span>
            {(info.tags ?? []).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          {/* 投稿情報 */}
          <p className="text-xs text-gray-400 mt-2">
            {info.is_anonymous ? '匿名' : info.submitter_name ?? '匿名'} が投稿 · {fmtDate(info.created_at)}
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">攻略情報</p>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{info.detail}</p>
          </div>

          {info.exam_tips && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">テスト対策</p>
              <p className="text-sm text-green-800 leading-relaxed">{info.exam_tips}</p>
            </div>
          )}

          {info.course_id && (
            <button
              onClick={() => { onClose(); onNavigateToExams(info.course_id) }}
              className="w-full text-white text-sm font-medium rounded-lg py-2.5 transition"
              style={{ backgroundColor: '#40916c' }}
            >
              この科目の過去問を見る
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** 授業情報投稿モーダル */
function AddCourseInfoModal({ profile, onClose, onSubmit, showToast }) {
  const [courseId,    setCourseId]    = useState('')
  const [name,        setName]        = useState('')
  const [schedule,    setSchedule]    = useState('')
  const [difficulty,  setDifficulty]  = useState('普通')
  const [tagsInput,   setTagsInput]   = useState('')   // カンマ区切り入力
  const [summary,     setSummary]     = useState('')
  const [detail,      setDetail]      = useState('')
  const [examTips,    setExamTips]    = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [submitting,  setSubmitting]  = useState(false)

  // 科目選択時に科目名を自動入力
  function handleCourseSelect(id) {
    setCourseId(id)
    if (id) {
      const course = courses.find((c) => c.id === id)
      if (course) setName(course.name)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim())    { showToast('科目名を入力してください', 'error'); return }
    if (!summary.trim()) { showToast('一言まとめを入力してください', 'error'); return }
    if (!detail.trim())  { showToast('攻略情報を入力してください', 'error'); return }

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)

    setSubmitting(true)
    try {
      await onSubmit({
        course_id:  courseId || null,
        name:       name.trim(),
        schedule:   schedule.trim() || null,
        difficulty,
        tags,
        summary:    summary.trim(),
        detail:     detail.trim(),
        exam_tips:  examTips.trim() || null,
        isAnonymous,
      }, profile)
      showToast('投稿しました', 'success')
      onClose()
    } catch (err) {
      showToast('投稿に失敗しました: ' + (err.message ?? ''), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800">授業情報を投稿</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* 科目選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              科目 <span className="text-gray-400 text-xs">(マスタから選ぶか、下の欄に直接入力)</span>
            </label>
            <select
              value={courseId}
              onChange={(e) => handleCourseSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option value="">選択しない(直接入力)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 科目名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">科目名 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 野菜園芸学"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* 曜日・時限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              曜日・時限 <span className="text-gray-400 text-xs">(任意)</span>
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="例: 火1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* 難易度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">難易度 *</label>
            <div className="flex gap-2">
              {['楽単', '普通', '難'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition border ${
                    difficulty === d
                      ? d === '楽単' ? 'bg-green-100 text-green-700 border-green-300'
                        : d === '普通' ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タグ <span className="text-gray-400 text-xs">(カンマ区切り・任意)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="例: 出席重要, 小テストあり, 過去問有効"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* 一言まとめ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">一言まとめ * <span className="text-gray-400 text-xs">(50字以内)</span></label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={50}
              placeholder="例: 毎回出席してテストを受けるだけ。楽に単位が取れる。"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* 攻略情報 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">攻略情報 *</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={5}
              placeholder="授業の形式・注意点・体験談など自由に書いてください"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
            />
          </div>

          {/* テスト対策 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              テスト対策 <span className="text-gray-400 text-xs">(任意)</span>
            </label>
            <textarea
              value={examTips}
              onChange={(e) => setExamTips(e.target.value)}
              rows={2}
              placeholder="テストで役立つポイントがあれば"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
            />
          </div>

          {/* 匿名 */}
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
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm text-white rounded-lg transition disabled:opacity-50"
              style={{ backgroundColor: '#40916c' }}
            >
              {submitting ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
