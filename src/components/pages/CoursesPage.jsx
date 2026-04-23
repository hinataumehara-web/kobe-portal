import { useState } from 'react'
import { courses, CATEGORIES, SUBCATEGORIES } from '../../data/courses.js'

const CATEGORY_LABELS = Object.values(CATEGORIES)

const BADGE = {
  [SUBCATEGORIES.REQUIRED]: 'bg-amber-100 text-amber-700',
  [SUBCATEGORIES.ELECTIVE]: 'bg-blue-100 text-blue-700',
  [SUBCATEGORIES.FREE]:     'bg-gray-100 text-gray-500',
}

/**
 * 科目一覧ページ
 */
export default function CoursesPage() {
  const [filterCategory,    setFilterCategory]    = useState('すべて')
  const [filterSubcategory, setFilterSubcategory] = useState('すべて')

  const filtered = courses.filter((c) => {
    const catMatch = filterCategory    === 'すべて' || c.category    === filterCategory
    const subMatch = filterSubcategory === 'すべて' || c.subcategory === filterSubcategory
    return catMatch && subMatch
  })

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">科目一覧</h2>

      {/* フィルタ */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          <option value="すべて">すべてのカテゴリ</option>
          {CATEGORY_LABELS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterSubcategory}
          onChange={(e) => setFilterSubcategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          <option value="すべて">すべての区分</option>
          {Object.values(SUBCATEGORIES).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="self-center text-xs text-gray-400">{filtered.length} 件</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 text-xs">
            <tr>
              <th className="text-left px-3 py-2">科目名</th>
              <th className="text-left px-3 py-2 hidden lg:table-cell">カテゴリ</th>
              <th className="text-center px-3 py-2">区分</th>
              <th className="text-center px-3 py-2">単位</th>
              <th className="text-center px-3 py-2 hidden sm:table-cell">学年</th>
              <th className="text-center px-3 py-2 hidden sm:table-cell">学期</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">担当教員</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course, i) => (
              <tr key={course.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 font-medium text-gray-800">
                  {course.name}
                  {course.isFacultyDesignated && (
                    <span className="ml-1 text-xs text-blue-500">[学部指定]</span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-500 text-xs hidden lg:table-cell">
                  {course.category}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${BADGE[course.subcategory] ?? ''}`}>
                    {course.subcategory}
                  </span>
                </td>
                <td className="px-3 py-2 text-center text-gray-600">{course.credits ?? '—'}</td>
                <td className="px-3 py-2 text-center text-gray-500 text-xs hidden sm:table-cell">
                  {course.year ?? '—'}
                </td>
                <td className="px-3 py-2 text-center text-gray-500 text-xs hidden sm:table-cell">
                  {course.semester ?? '—'}
                </td>
                <td className="px-3 py-2 text-gray-500 text-xs hidden md:table-cell">
                  {course.teacher ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
