import { useState } from 'react'
import { courses, SUBCATEGORIES } from '../../data/courses.js'

const GRADES = ['未履修', '秀', '優', '良', '可', '不可']

const BADGE = {
  [SUBCATEGORIES.REQUIRED]: 'bg-red-100 text-red-700',
  [SUBCATEGORIES.ELECTIVE]: 'bg-blue-100 text-blue-700',
  [SUBCATEGORIES.FREE]:     'bg-gray-100 text-gray-500',
}

/**
 * 成績入力ページ
 * @param {{ credits: Array, updateGrade: Function, loading: boolean, showToast: Function }} props
 */
export default function CreditsPage({ credits, updateGrade, loading, showToast }) {
  const [saving, setSaving] = useState(null) // 保存中の courseId

  async function handleGradeChange(courseId, grade) {
    setSaving(courseId)
    try {
      await updateGrade(courseId, grade)
    } catch (err) {
      showToast('保存に失敗しました: ' + (err.message || ''), 'error')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">成績入力</h2>
      <p className="text-xs text-gray-500 mb-4">
        各科目の成績を選択してください。変更は自動的にクラウドに保存されます。
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-red-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 text-xs">
              <tr>
                <th className="text-left px-3 py-2">科目名</th>
                <th className="text-center px-3 py-2 hidden sm:table-cell">単位</th>
                <th className="text-center px-3 py-2">区分</th>
                <th className="text-center px-3 py-2">成績</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, i) => {
                const uc    = credits.find((c) => c.course_id === course.id)
                const grade = uc?.grade ?? '未履修'
                const isSaving = saving === course.id

                return (
                  <tr key={course.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-medium text-gray-800">{course.name}</td>
                    <td className="px-3 py-2 text-center text-gray-600 hidden sm:table-cell">
                      {course.credits ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${BADGE[course.subcategory] ?? ''}`}>
                        {course.subcategory}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <select
                        value={grade}
                        onChange={(e) => handleGradeChange(course.id, e.target.value)}
                        disabled={isSaving}
                        className={`border rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 ${
                          grade === '未履修'
                            ? 'text-gray-400 border-gray-200'
                            : 'text-gray-700 border-gray-400'
                        } disabled:opacity-50`}
                      >
                        {GRADES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {isSaving && (
                        <span className="ml-1 text-xs text-gray-400">保存中…</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
