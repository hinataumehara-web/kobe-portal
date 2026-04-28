import { useState } from 'react'

/**
 * 入学年度選択モーダル
 * profile.admission_year が null の場合に App.jsx から表示する。
 * 切り替え時(既存データありの場合)は警告を出す。
 *
 * @param {{
 *   currentYear: number|null,  // 既存値(null = 未設定, 数値 = 切り替え)
 *   onSelect: (year: number) => Promise<void>,
 *   onClose?: () => void,      // 切り替えモードのみ提供
 * }} props
 */
export default function AdmissionYearModal({ currentYear, onSelect, onClose }) {
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const isSwitching = currentYear != null

  async function handleSelect(year) {
    setSaving(true)
    setError('')
    try {
      await onSelect(year)
    } catch (e) {
      setError('保存に失敗しました: ' + (e.message || ''))
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {/* ヘッダー */}
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {isSwitching ? 'カリキュラムを変更' : '入学年度を選択してください'}
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          {isSwitching
            ? '入学年度を変更すると、科目一覧・単位集計のデータが切り替わります。既に入力済みの成績データはそのまま残りますが、対応する科目が見つからない場合は集計されません。'
            : '入学年度によって卒業要件・科目一覧が異なります。正確な単位集計のため選択してください。後から変更することも可能です。'}
        </p>

        {/* 選択ボタン */}
        <div className="space-y-3">
          <button
            onClick={() => handleSelect(2024)}
            disabled={saving}
            className="w-full text-left border-2 border-gray-200 rounded-xl p-4 hover:border-green-600 hover:bg-green-50 transition disabled:opacity-50"
          >
            <div className="font-semibold text-gray-800">2024年度以前</div>
            <div className="text-xs text-gray-500 mt-0.5">旧制度(基礎教養・総合教養・高度教養科目)</div>
          </button>

          <button
            onClick={() => handleSelect(2025)}
            disabled={saving}
            className="w-full text-left border-2 border-gray-200 rounded-xl p-4 hover:border-green-600 hover:bg-green-50 transition disabled:opacity-50"
          >
            <div className="font-semibold text-gray-800">2025年度以降</div>
            <div className="text-xs text-gray-500 mt-0.5">新制度(基盤系・人文系・社会系・自然系・総合系)</div>
          </button>
        </div>

        {/* エラー */}
        {error && (
          <p className="mt-3 text-xs text-red-600">{error}</p>
        )}

        {/* 保存中インジケータ */}
        {saving && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
            保存中…
          </div>
        )}

        {/* キャンセル(切り替えモードのみ) */}
        {isSwitching && onClose && !saving && (
          <button
            onClick={onClose}
            className="mt-4 w-full text-center text-xs text-gray-400 underline"
          >
            キャンセル
          </button>
        )}
      </div>
    </div>
  )
}
