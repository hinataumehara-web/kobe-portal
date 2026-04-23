import { Home, BookOpen, GraduationCap, FileText, ClipboardList, BarChart2 } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'home',       label: 'ホーム', Icon: Home },
  { key: 'courses',    label: '科目',   Icon: BookOpen },
  { key: 'courseInfo', label: '授業',   Icon: GraduationCap },
  { key: 'exams',      label: '過去問', Icon: FileText },
  { key: 'credits',    label: '成績',   Icon: ClipboardList },
  { key: 'summary',    label: '集計',   Icon: BarChart2 },
]

/**
 * モバイル用下部タブナビ (md 未満で表示)
 */
export default function BottomNav({ page, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = page === key
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition"
            style={{ color: active ? '#4e8b68' : '#9ca3af' }}
          >
            <Icon size={18} />
            <span className="text-[10px] leading-none">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
