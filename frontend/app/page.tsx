'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Flame, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type User, type PathSection, type Skill } from '@/lib/api';
import { SplashScreen } from '@/components/SplashScreen';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LearningPath } from '@/components/LearningPath';
import { LoadingState, ErrorState } from '@/components/States';

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [path, setPath] = useState<PathSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const visited = typeof window !== 'undefined' && localStorage.getItem('duo-visited');
    if (!visited) {
      setShowSplash(true);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userData, pathData] = await Promise.all([
        api.getUser(),
        api.getPath(),
      ]);
      setUser(userData);
      setPath(pathData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  };

  const handleSplashComplete = () => {
    localStorage.setItem('duo-visited', 'true');
    setShowSplash(false);
  };

  const handleLessonClick = (skill: Skill, _lessonIndex: number) => {
    if (skill.locked) return;
    const lessonId = skill.lessons[0]?.id;
    if (!lessonId) return;
    const params = new URLSearchParams({
      lessonId: String(lessonId),
      skillName: skill.name,
      skillIcon: skill.icon,
    });
    router.push(`/lesson?${params.toString()}`);
  };

  const handleNavigate = (route: string) => {
    setSidebarOpen(false);
    router.push(route);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (loading) return <div className="min-h-screen bg-white"><LoadingState message="Loading your learning path..." /></div>;
  if (error || !user) return <ErrorState message={error || 'Failed to load'} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar active="learn" onNavigate={handleNavigate} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden"
            >
              <Sidebar active="learn" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2">
            <Menu className="w-7 h-7 text-duo-text" />
          </button>
          <TopBar user={user} />
        </header>

        {/* Learning path */}
        <main className="flex-1 px-4 py-8">
          {/* Daily goal card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="duo-card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-500" fill="currentColor" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-duo-text text-lg">Daily Goal</div>
                <div className="text-duo-light text-sm">Keep your streak alive — earn at least 50 XP today!</div>
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.xp / 50) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-orange-500">{user.streak}</div>
                <div className="text-xs text-duo-light font-bold">day streak</div>
              </div>
            </div>
          </motion.div>

          {/* Continue learning card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="duo-card p-5 flex items-center gap-4 bg-blue-50 border-blue-200">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                📚
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-duo-text text-lg">Continue Learning</div>
                <div className="text-duo-light text-sm">Pick up where you left off</div>
              </div>
              <div
                onClick={() => {
                  const firstSkill = path[0]?.skills.find((s) => !s.locked && s.lessons.length > 0);
                  if (firstSkill) handleLessonClick(firstSkill, 0);
                }}
                className="px-6 py-3 rounded-2xl bg-duo-blue text-white font-extrabold text-sm uppercase tracking-wide shadow-[0_5px_0_#1899d6] active:translate-y-[2px] active:shadow-none cursor-pointer"
              >
                Start
              </div>
            </div>
          </motion.div>

          {/* Path */}
          {/*<LearningPath sections={path} onLessonClick={handleLessonClick} /> */}
        </main>
      </div>
    </div>
  );
}
