/**
 * ヘッダー — PC / モバイル共通
 * curriculumLabel と onChangeCurriculum を受け取り、カリキュラムバッジを表示する。
 */
export default function Header({ profile, onSignOut, curriculumLabel, onChangeCurriculum }) {
  return (
    <header
      className="h-14 flex items-center justify-between px-4 shrink-0 border-b"
      style={{ backgroundColor: '#c8e6d0', borderColor: '#a8d5b5', color: '#1b4332' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm hidden sm:inline">
          神戸大学 食料環境経済学コース
        </span>
        <span className="font-bold text-sm sm:hidden">食料環境経済学コース</span>
        {profile && (
          <span className="text-xs hidden md:inline" style={{ color: '#3d6b52' }}>
            {profile.student_id}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {curriculumLabel && onChangeCurriculum && (
          <button
            onClick={onChangeCurriculum}
            className="hidden sm:flex items-center gap-1 text-xs rounded-full px-2.5 py-1 transition"
            style={{ backgroundColor: '#b7dfc2', color: '#1b4332' }}
            title="カリキュラムを変更"
          >
            <span>{curriculumLabel === '2025年度以降カリキュラム' ? '新制度' : '旧制度'}</span>
          </button>
        )}

        {profile && (
          <span className="text-xs font-medium" style={{ color: '#2d5a42' }}>{profile.name}</span>
        )}
        <button
          onClick={onSignOut}
          className="text-xs transition rounded px-2 py-1 border"
          style={{ color: '#2d5a42', borderColor: '#a8d5b5' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b7dfc2' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
