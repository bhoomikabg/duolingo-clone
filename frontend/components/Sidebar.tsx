import { Trophy, BookOpen, BarChart3, Settings, MessageCircle, Home, Target } from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { icon: Home, label: 'Learn', href: '/', active: true },
  { icon: BookOpen, label: 'Practice', href: '#', active: false },
  { icon: Trophy, label: 'Leaderboard', href: '#', active: false },
  { icon: Target, label: 'Quests', href: '#', active: false },
  { icon: BarChart3, label: 'Statistics', href: '#', active: false },
  { icon: MessageCircle, label: 'Forum', href: '#', active: false },
  { icon: Settings, label: 'Settings', href: '#', active: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col sticky top-[56px] h-[calc(100vh-56px)] w-56 py-6 gap-1 flex-shrink-0">
      {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
        <Link
          key={label}
          href={href}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 group
            ${active
              ? 'text-duo-green bg-duo-green-bg border-2 border-duo-green/30'
              : 'text-duo-gray-dark hover:bg-duo-gray-bg hover:text-duo-dark border-2 border-transparent'
            }`}
        >
          <Icon
            className={`w-5 h-5 transition-transform duration-150 group-hover:scale-110 ${
              active ? 'text-duo-green' : 'text-duo-gray'
            }`}
          />
          {label}
        </Link>
      ))}

      {/* Language selector */}
      <div className="mt-auto">
        <div className="rounded-2xl border-2 border-duo-border-gray bg-white p-3 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-white to-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-duo-gray font-semibold">Studying</span>
            <span className="text-sm font-extrabold text-duo-dark">French</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
