import { Home, BookOpen, GraduationCap, FileText, ClipboardList, BarChart2 } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'home',       label: 'ホーム',   Icon: Home },
  { key: 'courses',    label: '科目一覧', Icon: BookOpen },
  { key: 'courseInfo', label: '授業情報', Icon: GraduationCap },
  { key: 'exams',      label: '過去問',   Icon: FileText },
  { key: 'credits',    label: '成績入力', Icon: ClipboardList },
  { key: 'summary',    label: '単位集計', Icon: BarChart2 },
]

/**
 * PC 用左サイドバー (md 以上で表示)
 */
export default function Sidebar({ page, onNavigate }) {
  return (
    <aside
      className="hidden md:flex flex-col w-48 shrink-0 pt-2 border-r"
      style={{ backgroundColor: '#e8f5ec', borderColor: '#c8e6d0' }}
    >
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = page === key
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex items-center gap-3 py-3 text-sm transition text-left border-l-4 ${
              active ? 'pl-3' : 'pl-[14px]'
            }`}
            style={{
              paddingRight: '1rem',
              backgroundColor: active ? '#d1ead8' : 'transparent',
              borderLeftColor: active ? '#40916c' : 'transparent',
              color: active ? '#1b4332' : '#3d6b52',
              fontWeight: active ? '600' : '400',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#d1ead8' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <Icon size={16} />
            {label}
          </button>
        )
      })}
    </aside>
  )
}
