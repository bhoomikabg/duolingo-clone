'use client';

import { X } from 'lucide-react';
import { Heart } from 'lucide-react';

interface LessonHeaderProps {
  current: number;
  total: number;
  hearts: number;
  onExit: () => void;
}

export default function LessonHeader({ current, total, hearts, onExit }: LessonHeaderProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-duo-border-gray">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Close button */}
        <button
          onClick={onExit}
          className="text-duo-gray hover:text-duo-dark transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-duo-gray-bg"
          aria-label="Exit lesson"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-4 bg-duo-gray-light rounded-full overflow-hidden relative">
          <div
            className="h-full bg-duo-green rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Heart className="w-6 h-6 text-duo-red fill-duo-red" />
          <span className="font-extrabold text-duo-red text-base">{hearts}</span>
        </div>
      </div>
    </header>
  );
}
