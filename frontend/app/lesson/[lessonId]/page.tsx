import { getUser } from '@/lib/api';
import LessonRunner from '@/components/lesson/LessonRunner';

interface LessonPageProps {
  params: { lessonId: string };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lessonId = parseInt(params.lessonId, 10);

  // Fetch the user to get current hearts for the header
  let initialHearts = 5;
  try {
    const user = await getUser();
    initialHearts = user.hearts;
  } catch {
    // Fallback to default if backend is unreachable
  }

  return <LessonRunner lessonId={lessonId} initialHearts={initialHearts} />;
}
