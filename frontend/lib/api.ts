import type {
  User,
  Section,
  Exercise,
  LessonCompleteResponse,
  LessonCompleteRequest,
} from '@/types';

const BASE_URL = 'http://127.0.0.1:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getUser(): Promise<User> {
  return apiFetch<User>('/api/user');
}

export async function getPath(): Promise<Section[]> {
  return apiFetch<Section[]>('/api/path');
}

export async function getExercises(lessonId: number): Promise<Exercise[]> {
  return apiFetch<Exercise[]>(`/api/lessons/${lessonId}/exercises`);
}

export async function completeLesson(
  lessonId: number,
  payload: LessonCompleteRequest,
): Promise<LessonCompleteResponse> {
  return apiFetch<LessonCompleteResponse>(`/api/lessons/${lessonId}/complete`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function refillHearts(): Promise<void> {
  await apiFetch('/api/refill-hearts', { method: 'POST' });
}
