import { useState, useMemo } from 'react'

/**
 * 既存(平文)ユーザー向け移行モーダル。
 *
 * UI はパスフレーズ入力のみに簡素化。
 * 旧平文データの削除は内部で必ず実行する(purge: true 固定)。
 *
 * props:
 *   email
 *   onMigrate({passphrase, purge}) => Promise
 *   onSignOut
 */
export default function MigrationGate({ email, onMigrate, onSignOut }) {
  const [pass,    setPass]    = useState('')
  const [pass2,   setPass2]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const strength = useMemo(() => scoreStrength(pass), [pass])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (pass.length < 10)   return setError('パスフレーズは10文字以上にしてください')
    if (strength.score < 2) return setError(`パスフレーズが弱すぎます(${strength.label})`)
    if (pass !== pass2)     return setError('確認用パスフレーズが一致しません')

    setLoading(true)
    try {
      // 平文削除は常時実施
      await onMigrate({ passphrase: pass, purge: true })
    } catch (err) {
      setError(err.message || '移行中にエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5fbf6' }}>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-1">パスフレーズを設定してください</h2>
        <p className="text-xs text-gray-500 mb-1">{email}</p>
        <p className="text-xs text-gray-500 mb-5">
          ポータルでは氏名・学籍番号・履修科目・成績を、あなたのブラウザで暗号化してから保存します。サーバー管理者にも内容は見えません。最初に暗号化のためのパスフレーズを1つ決めてください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスフレーズ
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="10文字以上、推測されにくいもの"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              autoComplete="new-password"
              disabled={loading}
              autoFocus
            />
            {pass && <p className={`text-xs mt-1 ${strength.color}`}>強度: {strength.label}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスフレーズ(確認)
            </label>
            <input
              type="password"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 leading-relaxed">
            パスフレーズはサーバーに保存されません。<b>忘れた場合は次の画面で表示されるリカバリーコードでのみ復元できます。</b>両方とも失くすとデータは取り戻せません。
          </p>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#40916c' }}
          >
            {loading ? '暗号化中…(少し時間がかかります)' : '次へ'}
          </button>

          <button
            type="button"
            onClick={onSignOut}
            disabled={loading}
            className="w-full text-xs text-gray-500 hover:text-gray-700"
          >
            あとにする / ログアウト
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
