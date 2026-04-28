import { calcSummary } from '../../lib/creditCalc.js'
import { useCurriculum } from '../../hooks/useCurriculum.js'

const CRIMSON = '#4e8b68'

/**
 * 単位集計ページ
 */
export default function SummaryPage({ credits, loading }) {
  const curriculum = useCurriculum()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  const { results, totalEarned, totalRequired, nestedRequirements } = calcSummary(credits, curriculum)
  const pct = Math.min(100, Math.round((totalEarned / totalRequired) * 100))
  const is2025 = curriculum.key === '2025'

  // 2025制度向け: 人文・社会・自然・総合の個別カテゴリ(参考表示用)
  const HSN_DETAIL_CATS = is2025 ? new Set([
    curriculum.categories.LIBERAL_HUMANITIES,
    curriculum.categories.LIBERAL_SOCIAL,
    curriculum.categories.LIBERAL_NATURAL,
    curriculum.categories.LIBERAL_INTEGRATED,
    curriculum.categories.LIBERAL_HS_INNER,
  ]) : new Set()

  // 通常行として表示しない仮想カテゴリ(2025用)
  const SKIP_CATS = is2025 ? new Set([
    curriculum.categories.LIBERAL_HUMANITIES,
    curriculum.categories.LIBERAL_SOCIAL,
    curriculum.categories.LIBERAL_NATURAL,
    curriculum.categories.LIBERAL_INTEGRATED,
    curriculum.categories.LIBERAL_HS_INNER,
  ]) : new Set()

  function renderRows(group) {
    const groupResults = results.filter((r) => r.group === group)

    return groupResults.flatMap((r) => {
      // 2025制度で個別人文・社会・自然・総合行はスキップ(HSN_TOTALの下に入れ子表示)
      if (SKIP_CATS.has(r.category)) return []

      const met = r.requiredCredits === 0 || r.countable >= r.requiredCredits
      const row = (
        <tr key={r.category} className="border-t border-gray-50">
          <td className="px-4 py-2 text-gray-700">{r.description}</td>
          <td className="px-4 py-2 text-center text-xs text-gray-400 hidden sm:table-cell">
            {r.requiredCredits > 0
              ? `必要 ${r.requiredCredits} 単位`
              : r.maxCountableCredits != null
                ? `上限 ${r.maxCountableCredits} 単位`
                : '—'}
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

      // 2025制度の LIBERAL_HSN_TOTAL の後に入れ子行を追加
      if (is2025 && r.category === curriculum.categories.LIBERAL_HSN_TOTAL) {
        const detailRows = results
          .filter((d) => HSN_DETAIL_CATS.has(d.category))
          .map((d) => {
            const isHsInner = d.category === curriculum.categories.LIBERAL_HS_INNER
            const innerMet = d.requiredCredits === 0 || d.countable >= d.requiredCredits
            return (
              <tr key={d.category} className="border-t border-gray-50 bg-gray-50/60">
                <td className="px-4 py-1.5 pl-8 text-gray-500 text-xs">
                  {isHsInner ? `└ ${d.description}` : `└ ${d.description}`}
                </td>
                <td className="px-4 py-1.5 text-center text-xs text-gray-300 hidden sm:table-cell">
                  {d.requiredCredits > 0 ? `必要 ${d.requiredCredits} 単位` : '参考'}
                </td>
                <td className="px-4 py-1.5 text-right text-xs tabular-nums text-gray-500">
                  {d.earned}
                  {d.requiredCredits > 0 && (
                    <span className="text-gray-300"> / {d.requiredCredits}</span>
                  )}
                </td>
                <td className="px-4 py-1.5 text-center w-8">
                  {d.requiredCredits > 0 && (
                    innerMet
                      ? <span className="text-xs" style={{ color: CRIMSON }}>✓</span>
                      : <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
            )
          })
        return [row, ...detailRows]
      }

      return [row]
    })
  }

  // 表示グループ: 旧制度は 教養/専門, 新制度は 教養/専門/自由
  const displayGroups = is2025 ? ['教養', '専門', '自由'] : ['教養', '専門']

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">単位集計</h2>

      {/* 合計プログレス */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">取得単位数合計</span>
          <span className="text-3xl font-bold" style={{ color: CRIMSON }}>
            {totalEarned}
            <span className="text-base font-normal text-gray-400"> / {totalRequired} 単位</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: CRIMSON }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          残り {Math.max(0, totalRequired - totalEarned)} 単位 / {pct}%
        </p>
      </div>

      {/* 分類別 */}
      {displayGroups.map((group) => {
        const hasRows = results.some(
          (r) => r.group === group && !SKIP_CATS.has(r.category)
        )
        if (!hasRows) return null
        return (
          <div key={group} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600">
              {group}系
            </div>
            <table className="w-full text-sm">
              <tbody>
                {renderRows(group)}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
