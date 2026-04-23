import { useState } from 'react'

// 学番メール形式: 7桁数字 + 小文字1文字 + @stu.kobe-u.ac.jp
const EMAIL_RE = /^\d{7}[a-z]@stu\.kobe-u\.ac\.jp$/

/**
 * ログインフォーム
 * @param {{ onSent: (email: string) => void, signIn: (email: string) => Promise<void> }} props
 */
export default function LoginForm({ signIn, onSent }) {
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
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
      // 氏名は初回ログイン時に createProfile で使うため localStorage に一時保存
      // セキュリティ上問題のない情報(氏名のみ)なので許容する
      sessionStorage.setItem('portal:pending_name', name.trim())
      await signIn(email)
      onSent(email)
    } catch (err) {
      setError(err.message || 'メール送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        {/* ロゴエリア */}
        <div className="mb-6 text-center">
          <div
            className="inline-block w-12 h-12 rounded-full mb-3 flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: '#4e8b68' }}
          >
            神大
          </div>
          <h1 className="text-lg font-bold text-gray-800">神戸大学</h1>
          <p className="text-xs text-gray-500">食料環境経済学コース 学生ポータル</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              氏名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 山田 太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#4e8b68' }}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              @stu.kobe-u.ac.jp のメールアドレスのみ使用できます
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#4e8b68' }}
          >
            {loading ? '送信中...' : 'ログインリンクを送信'}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-400">
          パスワード不要 — メールのリンクをクリックするだけでログインできます
        </p>
      </div>
    </div>
  )
}
