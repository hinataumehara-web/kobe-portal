import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * 認証後のメインレイアウト
 * PC: Header + Sidebar + コンテンツ
 * モバイル: Header + コンテンツ + BottomNav
 */
export default function PortalLayout({
  profile,
  page,
  onNavigate,
  onSignOut,
  curriculumLabel,
  onChangeCurriculum,
  children,
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header
        profile={profile}
        onSignOut={onSignOut}
        curriculumLabel={curriculumLabel}
        onChangeCurriculum={onChangeCurriculum}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar page={page} onNavigate={onNavigate} />

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0" style={{ backgroundColor: '#f5fbf6' }}>
          <div className="p-4 max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <BottomNav page={page} onNavigate={onNavigate} />
    </div>
  )
}
