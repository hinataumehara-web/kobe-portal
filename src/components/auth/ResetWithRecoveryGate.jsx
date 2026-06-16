import { useState, useMemo } from 'react'
import { normalizeRecoveryCode } from '../../lib/crypto.js'

/**
 * パスフレーズ忘失時に、リカバリーコードでデータを取り戻し、
 * 新しいパスフレーズを設定する画面。
 *
 * props:
 *   email
 *   onSubmit({code, newPassphrase})  - useAuth.recoverWithCode を呼ぶ
 *   onCancel()                       - UnlockGate に戻る
 */
export default function ResetWithRecoveryGate({ email, onSubmit, onCancel }) {
  const [code,    setCode]    = useState('')
  const [pass,    setPass]    = useState('')
  const [pass2,   setPass2]   = useState('')
  const [agree,   setAgree]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const normalized = useMemo(() => normalizeRecoveryCode(code), [code])
  const strength   = useMemo(() => scoreStrength(pass), [pass])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (normalized.length < 16) return setError('リカバリーコードを正しく入力してください')
    if (pass.length < 10)       return setError('新しいパスフレーズは10文字以上にしてください')
    if (strength.score < 2)     return setError(`パスフレーズが弱すぎます(${strength.label})`)
    if (pass !== pass2)         return setError('確認用パスフレーズが一致しません')
    if (!agree)                 return setError('注意事項に同意してください')

    setLoading(true)
    try {
      await onSubmit({ code: normalized, newPassphrase: pass })
    } catch (err) {
      setError(err.message || 'リセットに失敗しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5fbf6' }}>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-1">パスフレーズの再設定</h2>
        <p className="text-xs text-gray-500 mb-1">{email}</p>
        <p className="text-xs text-gray-500 mb-5">
          発行されたリカバリーコードを入力すると、データを取り戻して新しいパスフレーズを設定できます。古いリカバリーコードは再設定後に使えなくなります。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              リカバリーコード
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
              autoFocus
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              ハイフンや空白は無視されます。{normalized.length}/20 文字
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスフレーズ
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              autoComplete="new-password"
            />
            {pass && <p className={`text-xs mt-1 ${strength.color}`}>強度: {strength.label}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスフレーズ(確認)
            </label>
            <input
              type="password"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              autoComplete="new-password"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              新しいリカバリーコードが発行され、古いコードは無効になることを理解しました。
            </span>
          </label>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#40916c' }}
          >
            {loading ? '処理中…' : 'パスフレーズを再設定する'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full text-xs text-gray-500 hover:text-gray-700"
          >
            キャンセル(解錠画面に戻る)
          </button>
        </form>
      </div>
    </div>
  )
}

function scoreStrength(s) {
  let n = 0
  if (s.length >= 10) n++
  if (s.length >= 16) n++
  if (/[a-z]/.test(s) && /[A-Z]/.test(s)) n++
  if (/\d/.test(s) && /[^a-zA-Z0-9]/.test(s)) n++
  if (s.length >= 24) n++
  const score = Math.min(3, Math.floor(n / 1.5))
  return [
    { score: 0, label: '弱い',       color: 'text-red-600' },
    { score: 1, label: '普通',       color: 'text-amber-600' },
    { score: 2, label: '強い',       color: 'text-green-700' },
    { score: 3, label: 'とても強い', color: 'text-green-700' },
  ][score]
}
