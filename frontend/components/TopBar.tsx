'use client';

import { Flame, Heart, Star, Gem, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from '@/lib/api';

interface TopBarProps {
  user: User;
}

export function TopBar({ user }: TopBarProps) {
  const stats = [
    { icon: Flame, value: user.streak, color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Gem, value: user.gems, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Heart, value: user.hearts, color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Star, value: user.xp, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 font-bold text-duo-text"
          >
            <Icon className={`w-6 h-6 ${stat.color}`} fill="currentColor" />
            <span className="text-sm sm:text-base">{stat.value}</span>
          </motion.div>
        );
      })}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="ml-2 w-10 h-10 rounded-full bg-duo-blue flex items-center justify-center text-white font-extrabold text-lg border-2 border-blue-300"
      >
        {user.name.charAt(0).toUpperCase()}
      </motion.div>
    </div>
  );
}
