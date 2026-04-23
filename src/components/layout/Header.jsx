/**
 * ヘッダー — PC / モバイル共通
 */
export default function Header({ profile, onSignOut }) {
  return (
    <header
      className="h-14 flex items-center justify-between px-4 text-white shrink-0"
      style={{ backgroundColor: '#7a1e2f' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm hidden sm:inline">
          神戸大学 食料環境経済学コース
        </span>
        <span className="font-bold text-sm sm:hidden">食料環境経済学コース</span>
        {profile && (
          <span className="text-xs opacity-70 hidden md:inline">
            {profile.student_id}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {profile && (
          <span className="text-xs opacity-80">{profile.name}</span>
        )}
        <button
          onClick={onSignOut}
          className="text-xs opacity-70 hover:opacity-100 transition border border-white/30 rounded px-2 py-1"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
