import { useState } from 'react'

/**
 * 初回ログイン後の氏名登録画面
 */
export default function ProfileSetup({ email, createProfile }) {
  const [name,    setName]    = useState(
    // LoginForm で sessionStorage に保存した氏名を初期値に使う
    () => sessionStorage.getItem('portal:pending_name') || ''
  )
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('氏名を入力してください'); return }

    setLoading(true)
    setError('')
    try {
      await createProfile(name.trim())
      sessionStorage.removeItem('portal:pending_name')
    } catch (err) {
      setError(err.message || 'プロフィールの作成に失敗しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-1">はじめまして</h2>
        <p className="text-xs text-gray-500 mb-6">{email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#7a1e2f' }}
          >
            {loading ? '登録中...' : 'ポータルに進む'}
          </button>
        </form>
      </div>
    </div>
  )
}
