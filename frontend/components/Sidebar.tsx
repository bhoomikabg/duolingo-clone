'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, User as UserIcon, Settings, Dumbbell, MessageCircle, BarChart3, Target, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  active: string;
  onNavigate: (route: string) => void;
  onClose?: () => void;
  mobile?: boolean;
}

const navItems = [
  { id: 'learn', label: 'Learn', icon: BookOpen, route: '/' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, route: '/leaderboard' },
  { id: 'profile', label: 'Profile', icon: UserIcon, route: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  { id: 'practice', label: 'Practice', icon: Dumbbell, route: '/practice' },
  { id: 'forum', label: 'Forum', icon: MessageCircle, route: '/forum' },
  { id: 'stats', label: 'Statistics', icon: BarChart3, route: '/stats' },
  { id: 'quests', label: 'Quests', icon: Target, route: '/quests' },
];

export function Sidebar({ active, onNavigate, onClose, mobile }: SidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {mobile && (
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6 text-duo-text" />
          </button>
        </div>
      )}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => onNavigate(item.route)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-duo-blue border-2 border-blue-200'
                  : 'text-duo-light hover:bg-gray-100 border-2 border-transparent'
              )}
            >
              <Icon className="w-7 h-7" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-gray-400 font-bold">
        MORE
      </div>
    </div>
  );
}
