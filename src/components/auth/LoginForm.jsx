import { useState } from 'react'

// 学番メール形式: 7桁数字 + 小文字1文字 + @stu.kobe-u.ac.jp
const EMAIL_RE = /^\d{7}[a-z]@stu\.kobe-u\.ac\.jp$/

// ロゴ部分(共通)
function Logo() {
  return (
    <div className="mb-6 text-center">
      <div
        className="inline-flex w-12 h-12 rounded-full mb-3 items-center justify-center text-white font-bold text-lg"
        style={{ backgroundColor: '#4e8b68' }}
      >
        神大
      </div>
      <h1 className="text-lg font-bold text-gray-800">神戸大学</h1>
      <p className="text-xs text-gray-500">食料環境経済学コース 学生ポータル</p>
    </div>
  )
}

/**
 * ログインフォーム
 * - 初回: 氏名 + メールアドレスを入力してマジックリンク送信
 * - 再訪問: 保存済みメールにワンクリックで送信
 */
export default function LoginForm({ signIn, onSent }) {
  // 前回ログイン時に保存したメール
  const savedEmail = localStorage.getItem('portal:saved_email') || ''

  // 再訪問モード: 保存済みメールがある場合
  const [mode, setMode] = useState(savedEmail ? 'quick' : 'full')

  const [email,   setEmail]   = useState('')
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // ── 再訪問モード(ワンクリック送信) ────────────────────────────
  async function handleQuickLogin() {
    setLoading(true)
    setError('')
    try {
      await signIn(savedEmail)
      onSent(savedEmail)
    } catch (err) {
      setError(err.message || 'メール送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // ── 初回フル入力モード ─────────────────────────────────────────
  async function handleFullLogin(e) {
    e.preventDefault()
    setError('')

    if (!EMAIL_RE.test(email)) {
      setError('学番メール形式で入力してください (例: 226r001a@stu.kobe-u.ac.jp)')
      return
    }
    if (!name.trim()) {
      setError('氏名を入力してください')
      return
    }

    setLoading(true)
    try {
      sessionStorage.setItem('portal:pending_name', name.trim())
      await signIn(email)
      onSent(email)
    } catch (err) {
      setError(err.message || 'メール送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // ── 別アカウントに切り替え ─────────────────────────────────────
  function switchAccount() {
    localStorage.removeItem('portal:saved_email')
    setMode('full')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <Logo />

        {/* ── 再訪問モード ── */}
        {mode === 'quick' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-gray-500 mb-1">前回ログインしたメールアドレス</p>
              <p className="text-sm font-medium text-gray-700 break-all">{savedEmail}</p>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50"
              style={{ backgroundColor: '#4e8b68' }}
            >
              {loading ? '送信中...' : 'ログインリンクを送信'}
            </button>

            <p className="text-xs text-center text-gray-400">
              メールのリンクをクリックするだけでログインできます
            </p>

            <div className="text-center pt-1">
              <button
                onClick={switchAccount}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                別のアカウントでログイン
              </button>
            </div>
          </div>
        )}

        {/* ── 初回フル入力モード ── */}
        {mode === 'full' && (
          <form onSubmit={handleFullLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">氏名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 山田 太郎"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学番メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例: 226r001a@stu.kobe-u.ac.jp"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <p className="text-xs text-gray-400 mt-1">
                @stu.kobe-u.ac.jp のみ使用できます
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50"
              style={{ backgroundColor: '#4e8b68' }}
            >
              {loading ? '送信中...' : 'ログインリンクを送信'}
            </button>

            <p className="mt-2 text-xs text-center text-gray-400">
              パスワード不要 — メールのリンクをクリックするだけでログインできます
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
