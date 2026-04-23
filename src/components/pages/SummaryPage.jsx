import { calcSummary } from '../../lib/creditCalc.js'
import { courses } from '../../data/courses.js'
import { TOTAL_REQUIRED_CREDITS } from '../../data/requirements.js'

const CRIMSON = '#4e8b68'

/**
 * 単位集計ページ
 */
export default function SummaryPage({ credits, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  const { results, totalEarned } = calcSummary(credits, courses)
  const pct = Math.min(100, Math.round((totalEarned / TOTAL_REQUIRED_CREDITS) * 100))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">単位集計</h2>

      {/* 合計プログレス */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">取得単位数合計</span>
          <span className="text-3xl font-bold" style={{ color: CRIMSON }}>
            {totalEarned}
            <span className="text-base font-normal text-gray-400"> / {TOTAL_REQUIRED_CREDITS} 単位</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: CRIMSON }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          残り {Math.max(0, TOTAL_REQUIRED_CREDITS - totalEarned)} 単位 / {pct}%
        </p>
      </div>

      {/* 分類別 */}
      {['教養', '専門'].map((group) => (
        <div key={group} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600">
            {group}系
          </div>
          <table className="w-full text-sm">
            <tbody>
              {results.filter((r) => r.group === group).map((r) => {
                const met = r.requiredCredits === 0 || r.countable >= r.requiredCredits
                return (
                  <tr key={r.category} className="border-t border-gray-50">
                    <td className="px-4 py-2 text-gray-700">{r.description}</td>
                    <td className="px-4 py-2 text-center text-xs text-gray-400 hidden sm:table-cell">
                      {r.requiredCredits > 0
                        ? `必要 ${r.requiredCredits} 単位`
                        : `上限 ${r.maxCountableCredits} 単位`}
                    </td>
                    <td className="px-4 py-2 text-right font-medium tabular-nums">
                      <span style={{ color: met ? CRIMSON : undefined }}>
                        {r.countable}
                      </span>
                      {r.requiredCredits > 0 && (
                        <span className="text-gray-400 text-xs"> / {r.requiredCredits}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center w-8">
                      {r.requiredCredits > 0 && (
                        met
                          ? <span className="text-xs" style={{ color: CRIMSON }}>✓</span>
                          : <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
