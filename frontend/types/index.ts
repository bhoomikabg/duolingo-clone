export interface User {
  id: number;
  name: string;
  streak: number;
  xp: number;
  hearts: number;
  gems: number;
}

export interface Lesson {
  id: number;
  order: number;
  completed: boolean;
}

export interface Skill {
  id: number;
  name: string;
  icon: string;
  lessons: Lesson[];
}

export interface Section {
  id: number;
  title: string;
  skills: Skill[];
}

export type LessonNodeStatus = 'completed' | 'current' | 'locked';

export type ExerciseType = 'MULTIPLE_CHOICE' | 'TRANSLATE' | 'FILL_IN_BLANK';

export interface Exercise {
  id: number;
  type: ExerciseType;
  question: string;
  choices: string[];
  correct_answer: string;
}

export interface LessonCompleteResponse {
  message: string;
  xp: number;
  hearts: number;
  streak: number;
}

export interface LessonCompleteRequest {
  xp_earned: number;
  hearts_remaining: number;
}
