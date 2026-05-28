import { useState } from 'react'
import { STUDENT_EMAIL_RE } from '../../hooks/useAuth.js'

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
 * ログインフォーム(コード認証版)
 * - 学番メール (例: 226r001a@stu.kobe-u.ac.jp) のみ受け付ける
 * - 入力されたメールに6桁の確認コードを送信する
 * - 氏名はコード認証後の ProfileSetup 画面で入力する
 */
export default function LoginForm({ signIn, onSent }) {
  // 前回ログイン時に保存したメール
  const savedEmail = localStorage.getItem('portal:saved_email') || ''

  // 再訪問モード: 保存済みメールがある場合
  const [mode, setMode] = useState(savedEmail ? 'quick' : 'full')

  const [email,   setEmail]   = useState('')
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

    const trimmed = email.trim().toLowerCase()

    if (!STUDENT_EMAIL_RE.test(trimmed)) {
      setError('学番メール形式で入力してください (例: 226r001a@stu.kobe-u.ac.jp)')
      return
    }

    setLoading(true)
    try {
      await signIn(trimmed)
      onSent(trimmed)
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
              {loading ? '送信中...' : '確認コードを送信'}
            </button>

            <p className="text-xs text-center text-gray-400">
              メールに届く6桁の確認コードを入力してログインします
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学番メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例: 226r001a@stu.kobe-u.ac.jp"
                autoComplete="email"
                inputMode="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <p className="text-xs text-gray-400 mt-1">
                @stu.kobe-u.ac.jp のみ使用できます(7桁数字 + 小文字1文字)
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
              {loading ? '送信中...' : '確認コードを送信'}
            </button>

            <p className="mt-2 text-xs text-center text-gray-400">
              パスワード不要 — メールに届く6桁の確認コードを入力してログインします
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
