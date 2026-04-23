/**
 * マジックリンク送信後の案内画面
 */
export default function MagicLinkSent({ email, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">メールを送信しました</h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">{email}</span> に
        </p>
        <p className="text-sm text-gray-600 mb-6">
          ログインリンクを送信しました。メールを確認してリンクをクリックしてください。
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 mb-6 text-left">
          <p className="font-medium mb-1">メールが届かない場合</p>
          <ul className="list-disc list-inside space-y-1">
            <li>迷惑メールフォルダを確認してください</li>
            <li>数分経ってから再度お試しください</li>
            <li>送信できるのは学番メール (@stu.kobe-u.ac.jp) のみです</li>
          </ul>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          メールアドレスを変更する
        </button>
      </div>
    </div>
  )
}
