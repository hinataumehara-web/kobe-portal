import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { calcSummary } from '../../lib/creditCalc.js'
import { useCurriculum } from '../../hooks/useCurriculum.js'

const CRIMSON = '#40916c'
const GREEN   = '#74c69d'

/**
 * ホーム(ダッシュボード)ページ
 */
export default function HomePage({ profile, credits, recentExams, onNavigate }) {
  const curriculum = useCurriculum()
  const { results, totalEarned, totalRequired } = calcSummary(credits, curriculum)
  const pct = Math.min(100, Math.round((totalEarned / totalRequired) * 100))

  // 教養系・専門系グラフデータ
  const chartData = ['教養', '専門'].map((group) => {
    const rows = results.filter((r) => r.group === group && !r.excludeFromTotal)
    const earned   = rows.reduce((s, r) => s + r.countable, 0)
    const required = rows.reduce((s, r) => s + r.requiredCredits, 0)
    return { name: `${group}系`, earned, required }
  })

  return (
    <div className="space-y-4">
      {/* 挨拶 */}
      <h2 className="text-lg font-bold text-gray-800">
        こんにちは、{profile?.name ?? ''}さん
      </h2>

      {/* 卒業進捗カード */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-end justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">卒業単位の進捗</span>
          <span className="text-3xl font-bold" style={{ color: CRIMSON }}>
            {totalEarned}
            <span className="text-base font-normal text-gray-400"> / {totalRequired} 単位</span>
          </span>
        </div>
        <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#d1ead8' }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: CRIMSON }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">残り {Math.max(0, totalRequired - totalEarned)} 単位</span>
          <span className="text-xs font-medium" style={{ color: CRIMSON }}>{pct}%</span>
        </div>
      </div>

      {/* 分類別グラフ */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">分類別取得状況</h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={52} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) =>
                name === 'earned' ? [`${value} 単位取得`, '取得'] : [`${value} 単位必要`, '必要']
              }
            />
            <Bar dataKey="required" fill="#e5e7eb" radius={4} barSize={14} name="required" />
            <Bar dataKey="earned"   radius={4} barSize={14} name="earned">
              {chartData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? GREEN : CRIMSON} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 最近の過去問 */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">最近追加された過去問</h3>
          <button
            onClick={() => onNavigate('exams')}
            className="text-xs underline"
            style={{ color: CRIMSON }}
          >
            すべて見る
          </button>
        </div>
        {recentExams.length === 0 ? (
          <p className="text-xs text-gray-400">まだ過去問が投稿されていません</p>
        ) : (
          <ul className="space-y-2">
            {recentExams.map((exam) => (
              <li key={exam.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {exam.course_name}
                  <span className="ml-2 text-xs text-gray-400">{exam.year}年度</span>
                </span>
                <span className="text-xs text-gray-400">
                  {exam.is_anonymous ? '匿名' : exam.uploader_name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
