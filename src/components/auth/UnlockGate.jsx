import { useState } from 'react'

/**
 * ログイン済み + プロフィール存在 + 鍵未ロード のときに表示するゲート画面
 *
 * props:
 *   email     - 表示用
 *   onUnlock(passphrase)  - 解錠ハンドラ。失敗時は throw する
 *   onSignOut             - キャンセル時の脱出口
 */
export default function UnlockGate({ email, onUnlock, onForgot, onSignOut }) {
  const [pass,    setPass]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!pass) return
    setLoading(true)
    setError('')
    try {
      await onUnlock(pass)
    } catch (err) {
      setError(err.message || 'パスフレーズが正しくありません')
      setLoading(false)
      setPass('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5fbf6' }}>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-1">データの解錠</h2>
        <p className="text-xs text-gray-500 mb-1">{email}</p>
        <p className="text-xs text-gray-500 mb-6">
          履修データを表示するには、登録したパスフレーズを入力してください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              データ暗号化パスフレーズ
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !pass}
            className="w-full text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#40916c' }}
          >
            {loading ? '解錠中…' : '解錠する'}
          </button>

          {onForgot && (
            <button
              type="button"
              onClick={onForgot}
              className="w-full text-xs text-green-700 hover:text-green-900 underline"
            >
              パスフレーズを忘れた(リカバリーコードで再設定)
            </button>
          )}

          <button
            type="button"
            onClick={onSignOut}
            className="w-full text-xs text-gray-500 hover:text-gray-700"
          >
            別のアカウントでログインする
          </button>
        </form>
      </div>
    </div>
  )
}
