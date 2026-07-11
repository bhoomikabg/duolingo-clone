import { getUser, getPath } from '@/lib/api';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import LearningPath from '@/components/LearningPath';
import type { User, Section } from '@/types';

async function fetchHomeData(): Promise<{ user: User; sections: Section[] } | null> {
  try {
    const [user, sections] = await Promise.all([getUser(), getPath()]);
    return { user, sections };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const data = await fetchHomeData();

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f7f7f7]">
        <div className="text-6xl animate-bounce-gentle">🦉</div>
        <h1 className="text-2xl font-extrabold text-duo-dark">Could not reach the server</h1>
        <p className="text-duo-gray font-semibold text-center max-w-sm">
          Make sure your FastAPI backend is running at{' '}
          <code className="bg-white px-2 py-0.5 rounded-lg border border-duo-border-gray text-sm">
            http://127.0.0.1:8000
          </code>
        </p>
        <a
          href="/"
          className="duo-btn-primary mt-2"
        >
          Try again
        </a>
      </div>
    );
  }

  const { user, sections } = data;

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <TopBar user={user} />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex gap-8">
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Progress summary card */}
          <ProgressCard user={user} />

          {/* Learning path */}
          <div className="mt-6">
            <LearningPath sections={sections} />
          </div>
        </main>

        {/* Desktop sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

function ProgressCard({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl border-2 border-duo-border-gray shadow-card p-5 flex items-center gap-5 animate-fade-in-up">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-duo-blue to-duo-purple flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0 shadow-sm">
        {user.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-lg text-duo-dark truncate">{user.name}</p>
        <p className="text-duo-gray font-semibold text-sm">Keep it up! 🎉</p>
      </div>

      {/* XP Progress */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-500 font-extrabold text-sm">{user.xp} XP</span>
        </div>
        <div className="w-32 h-2.5 rounded-full bg-duo-gray-light overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-duo-yellow to-yellow-400 transition-all duration-700"
            style={{ width: `${Math.min((user.xp % 500) / 5, 100)}%` }}
          />
        </div>
        <p className="text-xs text-duo-gray font-semibold">{500 - (user.xp % 500)} XP to next level</p>
      </div>
    </div>
  );
}
