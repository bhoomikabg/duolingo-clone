'use client';

import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import type { LessonNodeStatus } from '@/types';

interface LessonNodeProps {
  lessonId: number;
  skillName: string;
  skillIcon: string;
  status: LessonNodeStatus;
  animationDelay?: number;
}

export default function LessonNode({
  lessonId,
  skillName,
  skillIcon,
  status,
  animationDelay = 0,
}: LessonNodeProps) {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  return (
    <div
      className="flex flex-col items-center animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* START bubble for current lesson */}
      {isCurrent && (
        <div className="mb-3 relative">
          <div className="bg-white text-duo-dark text-xs font-extrabold px-4 py-1.5 rounded-xl shadow-md border border-duo-border-gray uppercase tracking-wider">
            Start
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-duo-border-gray rotate-45" />
        </div>
      )}

      {/* Node button */}
      {isLocked ? (
        <div className="relative group">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center
              bg-duo-gray-light border-b-[5px] border-duo-gray cursor-not-allowed
              transition-transform duration-200 opacity-60"
          >
            <Lock className="w-7 h-7 text-duo-gray" strokeWidth={2.5} />
          </div>
          {/* Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-duo-dark text-white text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg -translate-y-1 group-hover:translate-y-0">
            {skillName}
          </div>
        </div>
      ) : (
        <Link href={`/lesson/${lessonId}`} className="relative group outline-none">
          {/* Soft glowing ring for current lesson */}
          {isCurrent && (
            <div className="absolute inset-0 rounded-full animate-pulse-green pointer-events-none" />
          )}

          <div
            className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl
              transition-all duration-200 select-none
              ${isCompleted
                ? 'bg-duo-green border-b-[5px] border-duo-green-dark'
                : 'bg-duo-green border-b-[5px] border-duo-green-dark'
              }
              hover:bg-duo-green-light hover:scale-110 hover:-translate-y-0.5
              active:border-b-0 active:translate-y-[5px] active:scale-105
              ${isCurrent ? 'animate-bounce-gentle' : ''}
            `}
          >
            {isCompleted ? (
              <Check className="w-9 h-9 text-white" strokeWidth={3.5} />
            ) : (
              <span className="leading-none select-none drop-shadow-sm">{skillIcon}</span>
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-duo-dark text-white text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 pointer-events-none shadow-lg -translate-y-1 group-hover:translate-y-0 z-20">
            {skillName}
          </div>
        </Link>
      )}
    </div>
  );
}
