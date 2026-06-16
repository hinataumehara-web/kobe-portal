import { useState, useMemo } from 'react'

/**
 * 初回ログイン時の「氏名 + データ暗号化パスフレーズ」登録画面
 *
 * props:
 *   email           - 認証済みメール(表示専用)
 *   defaultStudentId - メールから抽出した学籍番号(編集不可で表示)
 *   onSubmit({ name, passphrase }) - 完了時のハンドラ
 */
export default function PassphraseSetup({ email, defaultStudentId, onSubmit }) {
  const [name,    setName]    = useState('')
  const [pass,    setPass]    = useState('')
  const [pass2,   setPass2]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const strength = useMemo(() => scoreStrength(pass), [pass])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('氏名を入力してください')
    if (pass.length < 10) return setError('パスフレーズは10文字以上にしてください')
    if (strength.score < 2) return setError(`パスフレーズが弱すぎます(${strength.label})`)
    if (pass !== pass2) return setError('確認用パスフレーズが一致しません')

    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), passphrase: pass })
    } catch (err) {
      setError(err.message || '登録に失敗しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5fbf6' }}>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-1">はじめまして</h2>
        <p className="text-xs text-gray-500 mb-1">{email}</p>
        <p className="text-xs text-gray-500 mb-6">
          メール認証が完了しました。氏名と、履修データを暗号化するためのパスフレーズを登録してください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学籍番号</label>
            <input
              type="text"
              value={defaultStudentId}
              disabled
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">氏名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 山田 太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              データ暗号化パスフレーズ
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="10文字以上、推測されにくいもの"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              autoComplete="new-password"
            />
            {pass && (
              <p className={`text-xs mt-1 ${strength.color}`}>
                強度: {strength.label}
              </p>
            )}
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
            {loading ? '登録中...' : 'ポータルに進む'}
          </button>
        </form>
      </div>
    </div>
  )
}

/**
 * パスフレーズの強度を雑にスコアリング
 *   0: 弱い  1: 普通  2: 強い  3: とても強い
 */
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
