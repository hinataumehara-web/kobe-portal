import { useState, useRef, useEffect } from 'react'

/**
 * 6桁の確認コードを入力するフォーム
 *
 * - メールに送られた 6桁数字を入力 → verifyOtp で検証
 * - 成功すると onAuthStateChange 経由でセッションが張られ、
 *   App.jsx 側でプロフィール作成画面 or ポータルに遷移する
 */
export default function VerifyCodeForm({ email, verifyCode, resend, onBack }) {
  const [code,      setCode]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [error,     setError]     = useState('')
  const [info,      setInfo]      = useState('')
  const inputRef = useRef(null)

  // 初期表示時に入力欄へフォーカス
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    const cleaned = code.replace(/\s+/g, '')
    if (!/^\d{6}$/.test(cleaned)) {
      setError('確認コードは6桁の数字で入力してください')
      return
    }

    setLoading(true)
    try {
      await verifyCode(email, cleaned)
      // 成功時は App 側でセッション検知して画面遷移するので何もしない
    } catch (err) {
      const msg = err?.message || ''
      if (/expired|invalid|otp/i.test(msg)) {
        setError('コードが無効または期限切れです。再送信してください')
      } else {
        setError(msg || '認証に失敗しました')
      }
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setInfo('')
    setResending(true)
    try {
      await resend(email)
      setInfo('確認コードを再送信しました。メールを確認してください')
      setCode('')
      inputRef.current?.focus()
    } catch (err) {
      setError(err?.message || '再送信に失敗しました')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📬</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">確認コードを送信しました</h2>
          <p className="text-sm text-gray-600 break-all">
            <span className="font-medium">{email}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            届いた6桁の確認コードを入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              確認コード(6桁)
            </label>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {info && !error && (
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#4e8b68' }}
          >
            {loading ? '確認中...' : '認証する'}
          </button>
        </form>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 mt-6 text-left">
          <p className="font-medium mb-1">コードが届かない場合</p>
          <ul className="list-disc list-inside space-y-1">
            <li>迷惑メールフォルダを確認してください</li>
            <li>数分経ってから再度お試しください</li>
            <li>送信できるのは学番メール (@stu.kobe-u.ac.jp) のみです</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-xs text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
          >
            {resending ? '再送信中...' : '確認コードを再送信する'}
          </button>
          <button
            onClick={onBack}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            メールアドレスを変更する
          </button>
        </div>
      </div>
    </div>
  )
}
