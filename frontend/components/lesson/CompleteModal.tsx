'use client';

import { Trophy, Star, Flame, Heart } from 'lucide-react';

interface CompleteModalProps {
  show: boolean;
  xpEarned: number;
  result: {
    xp: number;
    hearts: number;
    streak: number;
  } | null;
  onContinue: () => void;
}

export default function CompleteModal({ show, xpEarned, result, onContinue }: CompleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col items-center gap-6 animate-scale-in">
        {/* Trophy */}
        <div className="w-20 h-20 rounded-full bg-duo-yellow/20 flex items-center justify-center animate-bounce-gentle">
          <Trophy className="w-12 h-12 text-duo-yellow" strokeWidth={2} />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-duo-yellow text-center">
          Lesson Complete!
        </h2>

        {/* Stats */}
        <div className="w-full flex flex-col gap-3">
          <StatRow
            icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
            label="Total XP"
            value={`${result?.xp ?? xpEarned}`}
            highlight
          />
          <StatRow
            icon={<Flame className="w-6 h-6 text-orange-500 fill-orange-500" />}
            label="Day streak"
            value={`${result?.streak ?? 0}`}
          />
          <StatRow
            icon={<Heart className="w-6 h-6 text-duo-red fill-duo-red" />}
            label="Hearts remaining"
            value={`${result?.hearts ?? 0}`}
          />
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="duo-btn-primary w-full uppercase tracking-wider text-base py-4"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2
        ${highlight ? 'bg-yellow-50 border-yellow-300' : 'bg-duo-gray-bg border-duo-border-gray'}
      `}
    >
      {icon}
      <span className="font-bold text-duo-dark flex-1">{label}</span>
      <span className="font-extrabold text-duo-dark text-lg">{value}</span>
    </div>
  );
}
