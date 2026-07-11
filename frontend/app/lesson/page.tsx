'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, type User } from '@/lib/api';
import { LessonPlayer } from '@/components/LessonPlayer';
import { LoadingState, ErrorState } from '@/components/States';

function LessonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = Number(searchParams.get('lessonId'));
  const skillName = searchParams.get('skillName') || 'Lesson';
  const skillIcon = searchParams.get('skillIcon') || '📚';

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId || isNaN(lessonId)) {
      router.push('/');
      return;
    }
    api.getUser()
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [lessonId, router]);

  if (loading) return <LoadingState message="Preparing your lesson..." />;
  if (error || !user) return <ErrorState message={error || 'User not found'} onRetry={() => router.push('/')} />;

  return (
    <LessonPlayer
      lessonId={lessonId}
      skillName={skillName}
      skillIcon={skillIcon}
      user={user}
      onUserUpdate={setUser}
    />
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading..." />}>
      <LessonContent />
    </Suspense>
  );
}
