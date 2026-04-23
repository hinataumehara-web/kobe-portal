import { useState } from 'react'
import { courseInfoList } from '../../data/courseInfo.js'

const DIFFICULTY_BADGE = {
  楽単: 'bg-green-100 text-green-700',
  普通: 'bg-yellow-100 text-yellow-700',
  難:   'bg-red-100   text-red-700',
}

const DIFFICULTIES = ['すべて', '楽単', '普通', '難']

/**
 * 授業情報ページ
 */
export default function CourseInfoPage({ onNavigateToExams }) {
  const [search,     setSearch]     = useState('')
  const [difficulty, setDifficulty] = useState('すべて')
  const [selected,   setSelected]   = useState(null) // 詳細モーダル用

  const filtered = courseInfoList.filter((info) => {
    const nameMatch = !search || info.name.includes(search)
    const diffMatch = difficulty === 'すべて' || info.difficulty === difficulty
    return nameMatch && diffMatch
  })

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">授業情報</h2>

      {/* 免責注記 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 mb-4">
        ※ これは先輩からの非公式な情報です。内容の正確性を保証するものではありません。
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
        <div className="flex gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                difficulty === d
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="self-center text-xs text-gray-400">{filtered.length} 件</span>
      </div>

      {/* カードグリッド */}
      {filtered.length === 0 ? (
        <p className="text-center py-12 text-gray-400 text-sm">該当する科目がありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((info) => (
            <CourseInfoCard
              key={info.courseId ?? info.name}
              info={info}
              onOpen={() => setSelected(info)}
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
    </div>
  )
}

/** 科目カード */
function CourseInfoCard({ info, onOpen }) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition cursor-pointer"
      onClick={onOpen}
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-snug">{info.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{info.schedule}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${DIFFICULTY_BADGE[info.difficulty]}`}>
          {info.difficulty}
        </span>
      </div>

      {/* タグ */}
      <div className="flex flex-wrap gap-1">
        {info.tags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* 一言まとめ */}
      <p className="text-xs text-gray-600 leading-relaxed">{info.summary}</p>

      <button
        className="mt-auto text-xs font-medium text-green-700 hover:underline text-right"
      >
        詳細を見る →
      </button>
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
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_BADGE[info.difficulty]}`}>
              {info.difficulty}
            </span>
            {info.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 本文 */}
        <div className="px-6 py-4 space-y-4">
          {/* 詳細テキスト */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">攻略情報</p>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{info.detail}</p>
          </div>

          {/* テスト対策 */}
          {info.examTips && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">テスト対策</p>
              <p className="text-sm text-green-800 leading-relaxed">{info.examTips}</p>
            </div>
          )}

          {/* 過去問ボタン */}
          {info.courseId && (
            <button
              onClick={() => {
                onClose()
                onNavigateToExams(info.courseId)
              }}
              className="w-full text-white text-sm font-medium rounded-lg py-2.5 transition"
              style={{ backgroundColor: '#4e8b68' }}
            >
              この科目の過去問を見る
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
