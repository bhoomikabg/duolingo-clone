'use client';

import type { Section, LessonNodeStatus } from '@/types';
import SectionBanner from './SectionBanner';
import LessonNode from './LessonNode';

interface LearningPathProps {
  sections: Section[];
}

// Longer, more natural zig-zag pattern that alternates left and right
// Mimics Duolingo's winding path — wider sweep, more nodes before returning
const ZIGZAG_X: number[] = [
  50, 62, 74, 82, 74, 62, 50, 38, 26, 18, 26, 38,
];

function getZigzagX(index: number): number {
  return ZIGZAG_X[index % ZIGZAG_X.length];
}

// Replace the coffee emoji with a more appropriate learning icon
const ICON_OVERRIDES: Record<string, string> = {
  '☕': '📖',
};

function mapIcon(icon: string): string {
  return ICON_OVERRIDES[icon] ?? icon;
}

interface FlatLesson {
  lessonId: number;
  skillName: string;
  skillIcon: string;
  completed: boolean;
}

function flattenSectionLessons(section: Section): FlatLesson[] {
  const lessons: FlatLesson[] = [];
  for (const skill of section.skills) {
    for (const lesson of skill.lessons) {
      lessons.push({
        lessonId: lesson.id,
        skillName: skill.name,
        skillIcon: mapIcon(skill.icon),
        completed: lesson.completed,
      });
    }
  }
  return lessons;
}

function resolveStatuses(lessons: FlatLesson[]): LessonNodeStatus[] {
  let foundCurrent = false;
  return lessons.map((l) => {
    if (l.completed) return 'completed';
    if (!foundCurrent) {
      foundCurrent = true;
      return 'current';
    }
    return 'locked';
  });
}

function isSectionUnlocked(sectionIndex: number, allSections: Section[]): boolean {
  if (sectionIndex === 0) return true;
  for (let i = 0; i < sectionIndex; i++) {
    const lessons = flattenSectionLessons(allSections[i]);
    if (lessons.some((l) => !l.completed)) return false;
  }
  return true;
}

const NODE_SIZE = 72;
const NODE_SPACING = 100;
const START_Y = 10;

function buildPathD(nodes: { xPercent: number }[], totalHeight: number): string {
  if (nodes.length < 2) return '';
  const halfNode = NODE_SIZE / 2;

  const points = nodes.map((n, i) => ({
    x: n.xPercent,
    y: ((START_Y + i * NODE_SPACING + halfNode) / totalHeight) * 100,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function LearningPath({ sections }: LearningPathProps) {
  let globalNodeIndex = 0;

  return (
    <div className="flex flex-col gap-8 pb-20">
      {sections.map((section, sectionIndex) => {
        const lessons = flattenSectionLessons(section);
        const unlocked = isSectionUnlocked(sectionIndex, sections);
        const statuses: LessonNodeStatus[] = unlocked
          ? resolveStatuses(lessons)
          : lessons.map((): LessonNodeStatus => 'locked');

        const nodes = lessons.map((lesson, i) => {
          const idx = globalNodeIndex + i;
          return { ...lesson, status: statuses[i], xPercent: getZigzagX(idx) };
        });
        globalNodeIndex += lessons.length;

        const totalHeight = nodes.length * NODE_SPACING + 20;

        return (
          <div key={section.id} className="flex flex-col gap-5">
            <SectionBanner title={section.title} index={sectionIndex} />

            {nodes.length > 0 ? (
              <div className="relative" style={{ height: `${totalHeight}px` }}>
                {/* Connecting dotted path */}
                {nodes.length > 1 && (
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <path
                      d={buildPathD(nodes, totalHeight)}
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="5 4"
                    />
                  </svg>
                )}

                {/* Lesson nodes */}
                {nodes.map((node, i) => (
                  <div
                    key={node.lessonId}
                    className="absolute"
                    style={{
                      left: `calc(${node.xPercent}% - ${NODE_SIZE / 2}px)`,
                      top: `${START_Y + i * NODE_SPACING}px`,
                      zIndex: 10,
                    }}
                  >
                    <LessonNode
                      lessonId={node.lessonId}
                      skillName={node.skillName}
                      skillIcon={node.skillIcon}
                      status={node.status}
                      animationDelay={sectionIndex * 80 + i * 50}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <LockedSectionPlaceholder />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LockedSectionPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4 opacity-40 select-none">
      <div className="flex gap-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-16 h-16 rounded-full bg-duo-gray-light border-b-4 border-duo-gray flex items-center justify-center text-2xl"
          >
            🔒
          </div>
        ))}
      </div>
      <p className="text-duo-gray font-bold text-sm text-center">
        Complete the previous section to unlock
      </p>
    </div>
  );
}
