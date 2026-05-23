import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, X } from 'lucide-react'
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

// 2025制度の仮想集計カテゴリ(ユーザー選択肢から除外)
const VIRTUAL_CATS = new Set(['人文系・社会系 小計', '人文社会自然総合 合計', '自由選択科目'])

const CUSTOM_GRADES = ['未履修', '秀', '優', '良', '可', '不可']

const EMPTY_FORM = { name: '', category: '', credits: 2, grade: '未履修' }

/**
 * 成績入力ページ — グループ別折りたたみ表示 + 共有自由科目
 */
export default function CreditsPage({
  credits,
  updateGrade,
  updateSharedGrade,
  updateCustomCredit,
  deleteCustomCredit,
  sharedCourses = [],
  addSharedCourse,
  deleteSharedCourse,
  profile,
  loading,
  showToast,
}) {
  const curriculum = useCurriculum()
  const { courses, subcategories, categories, key: curriculumKey } = curriculum

  const BADGE = {
    [subcategories.REQUIRED]: 'bg-amber-100 text-amber-700',
    [subcategories.ELECTIVE]: 'bg-blue-100 text-blue-700',
    [subcategories.FREE]:     'bg-gray-100 text-gray-500',
  }

  const [saving, setSaving]           = useState(null)   // 保存中の courseId
  const [savingShared, setSavingShared] = useState(null) // 保存中の shared_course_id
  const [collapsed, setCollapsed]     = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm]         = useState(EMPTY_FORM)
  const [savingAdd, setSavingAdd]     = useState(false)

  // カテゴリ選択肢(仮想集計カテゴリを除外)
  const selectableCategories = Object.values(categories).filter((c) => !VIRTUAL_CATS.has(c))

  // レガシー自由入力科目(course_id・shared_course_id ともになし)
  const legacyCustomCredits = credits.filter((c) => !c.course_id && !c.shared_course_id)

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

  async function handleSharedGradeChange(sharedCourseId, grade) {
    setSavingShared(sharedCourseId)
    try {
      await updateSharedGrade(sharedCourseId, grade)
    } catch (err) {
      showToast('保存に失敗しました: ' + (err.message || ''), 'error')
    } finally {
      setSavingShared(null)
    }
  }

  async function handleAddSharedCourse() {
    if (!addForm.name.trim()) { showToast('科目名を入力してください', 'error'); return }
    if (!addForm.category)    { showToast('分類を選択してください', 'error');   return }
    const creditsNum = Number(addForm.credits)
    if (!creditsNum || creditsNum < 1) { showToast('単位数(1以上)を入力してください', 'error'); return }

    setSavingAdd(true)
    try {
      await addSharedCourse({
        name:         addForm.name.trim(),
        category:     addForm.category,
        credits:      creditsNum,
        creator_name: profile?.name ?? '',
      })
      setShowAddForm(false)
      setAddForm(EMPTY_FORM)
      showToast('科目を追加しました。全員が成績を入力できます。', 'success')
    } catch (err) {
      showToast('追加に失敗しました: ' + (err.message || ''), 'error')
    } finally {
      setSavingAdd(false)
    }
  }

  async function handleDeleteSharedCourse(id) {
    if (!window.confirm('この科目を削除しますか？全員の成績データも削除されます。')) return
    try {
      await deleteSharedCourse(id)
      showToast('削除しました', 'success')
    } catch (err) {
      showToast('削除に失敗しました: ' + (err.message || ''), 'error')
    }
  }

  async function handleLegacyDelete(id) {
    try {
      await deleteCustomCredit(id)
      showToast('削除しました', 'success')
    } catch (err) {
      showToast('削除に失敗しました: ' + (err.message || ''), 'error')
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
          {/* ----------------------------------------------------------------
              自由入力科目セクション(全員共有)
          ---------------------------------------------------------------- */}
          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-pink-50 text-pink-800 border-b border-pink-200">
              <div>
                <span className="font-semibold text-sm">自由入力科目</span>
                <span className="ml-2 text-xs opacity-60">誰かが追加した科目は全員が成績入力できます</span>
              </div>
              <button
                onClick={() => { setShowAddForm(true); setAddForm({ ...EMPTY_FORM, category: selectableCategories[0] ?? '' }) }}
                className="flex items-center gap-1 text-xs bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-1 rounded-full transition-colors"
              >
                <Plus size={12} /> 科目を追加
              </button>
            </div>

            {/* 共有科目テーブル */}
            {sharedCourses.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-white">
                  <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                    <tr>
                      <th className="text-left px-3 py-1.5">科目名</th>
                      <th className="text-left px-3 py-1.5 hidden sm:table-cell">分類</th>
                      <th className="text-center px-3 py-1.5 hidden sm:table-cell">単位</th>
                      <th className="text-center px-3 py-1.5">成績</th>
                      <th className="text-center px-3 py-1.5 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedCourses.map((sc, i) => {
                      const uc         = credits.find((c) => c.shared_course_id === sc.id)
                      const grade      = uc?.grade ?? '未履修'
                      const isSaving   = savingShared === sc.id
                      const isCreator  = sc.created_by === profile?.id

                      return (
                        <tr key={sc.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 font-medium text-gray-800">
                            {sc.name}
                            {sc.creator_name && (
                              <span className="ml-1.5 text-xs text-gray-400 font-normal">
                                ({sc.creator_name} が追加)
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-500 text-xs hidden sm:table-cell">{sc.category}</td>
                          <td className="px-3 py-2 text-center text-gray-600 hidden sm:table-cell">{sc.credits}</td>
                          <td className="px-3 py-2 text-center">
                            <select
                              value={grade}
                              onChange={(e) => handleSharedGradeChange(sc.id, e.target.value)}
                              disabled={isSaving}
                              className={`border rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 ${
                                grade === '未履修'
                                  ? 'text-gray-400 border-gray-200'
                                  : 'text-gray-700 border-gray-400'
                              } disabled:opacity-50`}
                            >
                              {CUSTOM_GRADES.map((g) => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                            {isSaving && <span className="ml-1 text-xs text-gray-400">保存中…</span>}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {isCreator && (
                              <button
                                onClick={() => handleDeleteSharedCourse(sc.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="削除(自分が追加した科目)"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 空の場合 */}
            {sharedCourses.length === 0 && !showAddForm && (
              <p className="text-xs text-gray-400 text-center py-4">
                まだ追加された科目はありません
              </p>
            )}

            {/* 科目追加フォーム */}
            {showAddForm && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-3">新規科目を追加（追加後は全員が成績入力できます）</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">科目名</label>
                    <input
                      type="text"
                      value={addForm.name}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="例: 経済地理学"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">分類</label>
                    <select
                      value={addForm.category}
                      onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                    >
                      {selectableCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">単位数</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={addForm.credits}
                      onChange={(e) => setAddForm((f) => ({ ...f, credits: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddSharedCourse}
                    disabled={savingAdd}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-sm rounded px-3 py-1.5 transition-colors"
                  >
                    {savingAdd ? '追加中…' : '追加する'}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-300 rounded transition-colors"
                  >
                    <X size={13} /> キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* レガシー自由入力科目(移行前データ) */}
            {legacyCustomCredits.length > 0 && (
              <div className="border-t border-dashed border-gray-200 px-4 py-2">
                <p className="text-xs text-gray-400 mb-1">以前の個人メモ（自分のみ表示）</p>
                <div className="space-y-1">
                  {legacyCustomCredits.map((cc) => (
                    <div key={cc.id} className="flex items-center justify-between text-xs text-gray-500">
                      <span>{cc.custom_name} ({cc.custom_category} / {cc.custom_credits}単位 / {cc.grade})</span>
                      <button onClick={() => handleLegacyDelete(cc.id)} className="text-gray-300 hover:text-red-500 ml-2">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------
              マスタ科目グループ
          ---------------------------------------------------------------- */}
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
