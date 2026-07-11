'use client';

import type { User } from '@/types';
import { Flame, Heart, Gem, Star, Zap } from 'lucide-react';

interface TopBarProps {
  user: User;
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-duo-border-gray shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-duo-green flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🦉</span>
          </div>
          <span className="font-extrabold text-duo-green text-lg tracking-tight hidden sm:block">
            DuoLearn
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1 sm:gap-4">
          <StatBadge
            icon={<Flame className="w-5 h-5 text-orange-500 fill-orange-500" />}
            value={user.streak}
            color="text-orange-500"
            label="Streak"
          />
          <div className="w-px h-6 bg-duo-border-gray hidden sm:block" />
          <StatBadge
            icon={<Heart className="w-5 h-5 text-duo-red fill-duo-red" />}
            value={user.hearts}
            color="text-duo-red"
            label="Hearts"
          />
          <div className="w-px h-6 bg-duo-border-gray hidden sm:block" />
          <StatBadge
            icon={<Gem className="w-5 h-5 text-duo-blue fill-duo-blue" />}
            value={user.gems}
            color="text-duo-blue"
            label="Gems"
          />
          <div className="w-px h-6 bg-duo-border-gray hidden sm:block" />
          <StatBadge
            icon={<Star className="w-5 h-5 text-duo-yellow fill-duo-yellow" />}
            value={user.xp}
            color="text-yellow-500"
            label="XP"
          />
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-duo-blue to-duo-purple flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-sm text-duo-dark hidden md:block">{user.name}</span>
        </div>
      </div>
    </header>
  );
}

function StatBadge({
  icon,
  value,
  color,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 group" title={label}>
      {icon}
      <span className={`font-extrabold text-sm ${color}`}>{value}</span>
    </div>
  );
}
