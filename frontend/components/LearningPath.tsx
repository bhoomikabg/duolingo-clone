'use client';

import { motion } from 'framer-motion';
import { Lock, Check, Star, Crown } from 'lucide-react';
import type { PathSection, Skill } from '@/lib/api';
import { cn } from '@/lib/utils';

interface LearningPathProps {
  sections: PathSection[];
  onLessonClick: (skill: Skill, lessonIndex: number) => void;
}

// Zigzag pattern for the path
const xOffsets = [0, 80, 120, 80, 0, -80, -120, -80, 0, 80, 120, 80, 0, -80, -120, -80];

export function LearningPath({ sections, onLessonClick }: LearningPathProps) {
  let globalLessonIndex = 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-32">
      {sections.map((section, sIdx) => (
        <div key={section.id} className="relative">
          {/* Section banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.2 }}
            className="flex items-center justify-center my-8"
          >
            <div className="px-6 py-3 rounded-2xl bg-duo-gold text-white font-extrabold text-lg uppercase tracking-wide shadow-lg flex items-center gap-2">
              <Crown className="w-5 h-5" fill="white" />
              {section.title}
            </div>
          </motion.div>

          {/* Skills and lessons */}
          {section.skills.map((skill) => {
            const lessons = skill.lessons;
            return (
              <div key={skill.id} className="relative">
                {lessons.length === 0 ? (
                  <div className="flex justify-center py-6">
                    <LockedNode skill={skill} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson, lIdx) => {
                      const xOffset = xOffsets[globalLessonIndex % xOffsets.length];
                      const firstIncomplete = lessons.findIndex((l) => !l.completed);

const isCompleted = lesson.completed;
const isCurrent =
  firstIncomplete !== -1 && lIdx === firstIncomplete;

const isLocked =
  firstIncomplete !== -1 && lIdx > firstIncomplete;
                      globalLessonIndex++;

                      return (
                        <div
                          key={lesson.id}
                          className="flex justify-center"
                          style={{ transform: `translateX(${xOffset}px)` }}
                        >
                          <LessonNode
                            skill={skill}
                            lessonIndex={lIdx}
                            isCompleted={isCompleted}
                            isCurrent={isCurrent}
                            isLocked={isLocked}
                            icon={skill.icon}
                            onClick={() => !isLocked && onLessonClick(
  {
    ...skill,
    lessons: [{ id: 1, completed: false }]
  },
  0
)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function LessonNode({
  skill,
  lessonIndex,
  isCompleted,
  isCurrent,
  isLocked,
  icon,
  onClick,
}: {
  skill: Skill;
  lessonIndex: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  icon: string;
  onClick: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Connecting line */}
      {lessonIndex > 0 && (
        <div className="absolute -top-4 w-1 h-4 bg-gray-300 rounded-full" />
      )}

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white rounded-xl border-2 border-gray-200 shadow-md text-xs font-bold text-duo-text whitespace-nowrap z-10">
        {skill.name}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-gray-200 rotate-45" />
      </div>

      <motion.button
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        onClick={onClick}
        className={cn(
          'relative w-20 h-20 rounded-full flex items-center justify-center text-3xl border-b-[6px] transition-all',
          isCompleted && 'bg-duo-green border-green-700',
          isCurrent && 'bg-duo-blue border-blue-700',
          isLocked && 'bg-gray-200 border-gray-300 cursor-not-allowed',
          !isCompleted && !isCurrent && !isLocked && 'bg-white border-gray-200'
        )}
        style={isCurrent ? { animation: 'pulse-glow 2s infinite' } : {}}
      >
        {isLocked ? (
          <Lock className="w-8 h-8 text-gray-400" />
        ) : isCompleted ? (
          <Check className="w-8 h-8 text-white" strokeWidth={4} />
        ) : (
          <span className="text-3xl">{icon}</span>
        )}

        {isCurrent && (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-10 left-1/2 -translate-x-1/2"
          >
            <Star className="w-6 h-6 text-duo-gold" fill="currentColor" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}

function LockedNode({ skill }: { skill: Skill }) {
  return (
    <div className="relative w-20 h-20 rounded-full bg-gray-200 border-b-[6px] border-gray-300 flex items-center justify-center cursor-not-allowed">
      <Lock className="w-8 h-8 text-gray-400" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white rounded-xl border-2 border-gray-200 shadow-md text-xs font-bold text-duo-text whitespace-nowrap z-10">
        {skill.name}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-gray-200 rotate-45" />
      </div>
    </div>
  );
}
