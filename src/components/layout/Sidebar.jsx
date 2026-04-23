import { Home, BookOpen, FileText, ClipboardList, BarChart2 } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'home',     label: 'ホーム',   Icon: Home },
  { key: 'courses',  label: '科目一覧', Icon: BookOpen },
  { key: 'exams',    label: '過去問',   Icon: FileText },
  { key: 'credits',  label: '成績入力', Icon: ClipboardList },
  { key: 'summary',  label: '単位集計', Icon: BarChart2 },
]

/**
 * PC 用左サイドバー (md 以上で表示)
 */
export default function Sidebar({ page, onNavigate }) {
  return (
    <aside
      className="hidden md:flex flex-col w-48 shrink-0 pt-2"
      style={{ backgroundColor: '#5c1622' }}
    >
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = page === key
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition text-left ${
              active
                ? 'bg-white/15 text-white font-medium'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        )
      })}
    </aside>
  )
}
