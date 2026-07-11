export const API_BASE_URL = 'http://127.0.0.1:8000';

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
  completed: boolean;
}

export interface Skill {
  id: number;
  name: string;
  icon: string;
  completed: boolean;
  locked: boolean;
  lessons: Lesson[];
}

export interface PathSection {
  id: number;
  title: string;
  skills: Skill[];
}

export type ExerciseType = 'MULTIPLE_CHOICE' | 'TRANSLATE' | 'FILL_IN_BLANK' | 'MATCH_PAIRS' | 'TYPE_ANSWER';

export interface Exercise {
  id: number;
  type: ExerciseType;
  question: string;
  correct_answer: string;
  choices: string[];
}

export interface LeaderboardEntry {
  name: string;
  xp: number;
}

export interface LessonCompleteResponse {
  message: string;
  xp: number;
  hearts: number;
  streak: number;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getUser: () => request<User>('/api/user'),
  getPath: () => request<PathSection[]>('/api/path'),
  getExercises: (lessonId: number) =>
    request<Exercise[]>(`/api/lessons/${lessonId}/exercises`),
  completeLesson: (lessonId: number, xpEarned: number, heartsRemaining: number) =>
    request<LessonCompleteResponse>(`/api/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ xp_earned: xpEarned, hearts_remaining: heartsRemaining }),
    }),
  getLeaderboard: () => request<LeaderboardEntry[]>('/api/leaderboard'),
};
