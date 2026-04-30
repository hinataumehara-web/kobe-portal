import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useCurriculum } from '../../hooks/useCurriculum.js'

const GRADES          = ['未履修', '秀', '優', '良', '可', '不可']
const GRADES_PASSFAIL = ['未履修', '合格', '不合格']
const FAILED_GRADES   = new Set(['未履修', '不可', '不合格'])

// 表示グループの順序
const GROUP_ORDER = [
  '基礎教養科目',
  '総合教養科目',
  '外国語科目',
  '情報科目',
  '健康・スポーツ科学',
  'その他の科目',
  '高度教養科目',
  '共通専門基礎科目',
  '自コース必修科目',
  '農学部選択科目（自コース・他コース）',
  '農学部自由科目（その他）',
  '自由科目',
]

// グループごとのヘッダー配色 (bg / text / border)
const GROUP_STYLE = {
  '基礎教養科目':                         'bg-sky-50     text-sky-800     border-sky-200',
  '総合教養科目':                         'bg-purple-50  text-purple-800  border-purple-200',
  '外国語科目':                           'bg-indigo-50  text-indigo-800  border-indigo-200',
  '情報科目':                             'bg-cyan-50    text-cyan-800    border-cyan-200',
  '健康・スポーツ科学':                   'bg-green-50   text-green-800   border-green-200',
  'その他の科目':                         'bg-gray-50    text-gray-700    border-gray-200',
  '高度教養科目':                         'bg-violet-50  text-violet-800  border-violet-200',
  '共通専門基礎科目':                     'bg-amber-50   text-amber-800   border-amber-200',
  '自コース必修科目':                     'bg-rose-50    text-rose-800    border-rose-200',
  '農学部選択科目（自コース・他コース）': 'bg-orange-50  text-orange-800  border-orange-200',
  '農学部自由科目（その他）':             'bg-teal-50    text-teal-800    border-teal-200',
  '自由科目':                             'bg-gray-50    text-gray-700    border-gray-200',
}

/**
 * 科目をどの表示グループに分類するか返す
 */
function getDisplayGroup(course, curriculumKey, categories) {
  const cat = course.category
  const sub = course.subcategory

  if (curriculumKey === '2025') {
    if (cat === categories.LIBERAL_BASE) return '基礎教養科目'
    if (
      cat === categories.LIBERAL_HUMANITIES ||
      cat === categories.LIBERAL_SOCIAL ||
      cat === categories.LIBERAL_NATURAL ||
      cat === categories.LIBERAL_INTEGRATED
    ) return '総合教養科目'
    if (cat === categories.FOREIGN_LANG_1 || cat === categories.FOREIGN_LANG_2) return '外国語科目'
    if (cat === categories.HEALTH_SPORTS) return '健康・スポーツ科学'
    if (cat === categories.COMMON_PRO_BASIC) return '共通専門基礎科目'
    if (cat === categories.PRO_FACULTY_COMMON || cat === categories.PRO_DEPT_COMMON) {
      return sub === '必修' ? '自コース必修科目' : 'その他の科目'
    }
    if (cat === categories.PRO_COURSE) {
      return sub === '必修' ? '自コース必修科目' : '農学部選択科目（自コース・他コース）'
    }
    if (cat === categories.PRO_RELATED) return '農学部選択科目（自コース・他コース）'
    return 'その他の科目'
  }

  // 旧制度(2024以前)
  if (cat === categories.BASIC_LIBERAL) return '基礎教養科目'
  if (cat === categories.GENERAL_LIBERAL) return '総合教養科目'
  if (cat === categories.FOREIGN_LANG_1 || cat === categories.FOREIGN_LANG_2) return '外国語科目'
  if (cat === categories.INFO) return '情報科目'
  if (cat === categories.HEALTH_SPORTS) return '健康・スポーツ科学'
  if (cat === categories.ADVANCED_LIBERAL_COURSE || cat === categories.ADVANCED_LIBERAL_OTHER) return '高度教養科目'
  if (cat === categories.COMMON_PRO_BASIC) return '共通専門基礎科目'
  if (cat === categories.PRO_FACULTY_COMMON) {
    return sub === '必修' ? '自コース必修科目' : 'その他の科目'
  }
  if (cat === categories.PRO_DEPT_COMMON) return '自コース必修科目'
  if (cat === categories.PRO_COURSE) {
    return sub === '必修' ? '自コース必修科目' : '農学部選択科目（自コース・他コース）'
  }
  if (cat === categories.PRO_OTHER_COURSE) return '農学部選択科目（自コース・他コース）'
  if (cat === categories.PRO_FREE_AGRI)    return '農学部自由科目（その他）'
  if (cat === categories.PRO_FREE_OTHER)   return '自由科目'
  return 'その他の科目'
}

/**
 * 成績入力ページ — グループ別折りたたみ表示
 * @param {{ credits: Array, updateGrade: Function, loading: boolean, showToast: Function }} props
 */
export default function CreditsPage({ credits, updateGrade, loading, showToast }) {
  const curriculum = useCurriculum()
  const { courses, subcategories, categories, key: curriculumKey } = curriculum

  const BADGE = {
    [subcategories.REQUIRED]: 'bg-amber-100 text-amber-700',
    [subcategories.ELECTIVE]: 'bg-blue-100 text-blue-700',
    [subcategories.FREE]:     'bg-gray-100 text-gray-500',
  }

  const [saving, setSaving]       = useState(null)   // 保存中の courseId
  const [collapsed, setCollapsed] = useState({})     // グループ折りたたみ状態

  const toggleGroup = (groupName) =>
    setCollapsed((prev) => ({ ...prev, [groupName]: !prev[groupName] }))

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

  // 科目をグループごとに振り分け
  const groupedCourses = {}
  for (const course of courses) {
    const group = getDisplayGroup(course, curriculumKey, categories)
    if (!groupedCourses[group]) groupedCourses[group] = []
    groupedCourses[group].push(course)
  }

  // 実際に科目が存在するグループだけ、定義順に絞り込む
  const activeGroups = GROUP_ORDER.filter((g) => groupedCourses[g]?.length > 0)

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">成績入力</h2>
      <p className="text-xs text-gray-500 mb-4">
        各科目の成績を選択してください。変更は自動的にクラウドに保存されます。
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {activeGroups.map((groupName) => {
            const groupCourses = groupedCourses[groupName]
            const isCollapsed  = !!collapsed[groupName]
            const passedCount  = groupCourses.filter((c) => {
              const uc = credits.find((x) => x.course_id === c.id)
              return uc && !FAILED_GRADES.has(uc.grade)
            }).length

            const headerStyle = GROUP_STYLE[groupName] ?? 'bg-gray-50 text-gray-700 border-gray-200'

            return (
              <div key={groupName} className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {/* グループヘッダー */}
                <button
                  className={`w-full flex items-center justify-between px-4 py-2.5 ${headerStyle} border-b`}
                  onClick={() => toggleGroup(groupName)}
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed
                      ? <ChevronRight size={14} className="flex-shrink-0" />
                      : <ChevronDown  size={14} className="flex-shrink-0" />
                    }
                    <span className="font-semibold text-sm">{groupName}</span>
                  </div>
                  <span className="text-xs opacity-60 ml-2 whitespace-nowrap">
                    {passedCount} / {groupCourses.length} 科目取得済み
                  </span>
                </button>

                {/* 科目テーブル */}
                {!isCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm bg-white">
                      <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                        <tr>
                          <th className="text-left px-3 py-1.5">科目名</th>
                          <th className="text-center px-3 py-1.5 hidden sm:table-cell">単位</th>
                          <th className="text-center px-3 py-1.5">区分</th>
                          <th className="text-center px-3 py-1.5">成績</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupCourses.map((course, i) => {
                          const uc       = credits.find((c) => c.course_id === course.id)
                          const grade    = uc?.grade ?? '未履修'
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
                                  {(course.isPassFail ? GRADES_PASSFAIL : GRADES).map((g) => (
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
          })}
        </div>
      )}
    </div>
  )
}
