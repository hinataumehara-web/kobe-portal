import { useState } from 'react'

/**
 * 発行されたリカバリーコードを1度だけ表示するモーダル
 *
 * props:
 *   code            - 表示するコード(XXXXX-XXXXX-XXXXX-XXXXX)
 *   onConfirm()     - 保存しましたチェック後の続行
 *   title?          - 任意の見出し
 *   description?    - 任意の説明
 */
export default function RecoveryCodeReveal({
  code,
  onConfirm,
  title = 'リカバリーコードを保存してください',
  description = 'パスフレーズを忘れた場合、このコードがあれば履修データを取り戻せます。サーバーには保存されないため、ここでしか確認できません。',
}) {
  const [copied,   setCopied]   = useState(false)
  const [agreed,   setAgreed]   = useState(false)
  const [revealed, setRevealed] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 古いブラウザ等
    }
  }

  function downloadTxt() {
    const blob = new Blob([
      `神戸大学 食料環境経済学コース 学生ポータル\n`,
      `リカバリーコード\n\n`,
      `${code}\n\n`,
      `※ このコードは1度しか表示されません。\n`,
      `※ パスフレーズを忘れたときの最後の手段になります。\n`,
      `※ 紛失するとデータを取り戻す手段は失われます。\n`,
    ], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recovery-code.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5fbf6' }}>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-xs text-gray-600 mb-5 leading-relaxed">{description}</p>

        <div className="border border-amber-300 bg-amber-50 rounded-lg p-4 mb-4">
          <div className="text-[10px] text-amber-700 uppercase tracking-wider mb-2">
            あなたのリカバリーコード
          </div>
          {revealed ? (
            <div className="font-mono text-lg tracking-wider text-gray-900 break-all select-all">
              {code}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full text-sm py-2 border border-amber-300 bg-white rounded text-amber-800 hover:bg-amber-100"
            >
              タップして表示(肩越しに見られていないことを確認)
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={copy}
            disabled={!revealed}
            className="flex-1 text-xs py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            {copied ? '✓ コピーしました' : 'コピー'}
          </button>
          <button
            type="button"
            onClick={downloadTxt}
            disabled={!revealed}
            className="flex-1 text-xs py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            .txt でダウンロード
          </button>
        </div>

        <label className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            このコードを安全な場所に保存しました。
            <b>失くした場合、パスフレーズを忘れるとデータを取り戻せないことを理解しました。</b>
          </span>
        </label>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!agreed || !revealed}
          className="w-full text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
          style={{ backgroundColor: '#40916c' }}
        >
          続ける
        </button>
      </div>
    </div>
  )
}
