'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Target, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type User } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingState, ErrorState } from '@/components/States';
import { Owl } from '@/components/Owl';

export default function QuestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.getUser().then((u) => { setUser(u); setLoading(false); }).catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleNavigate = (route: string) => { setSidebarOpen(false); router.push(route); };
  if (loading) return <div className="min-h-screen bg-white"><LoadingState /></div>;
  if (error || !user) return <ErrorState message={error || undefined} onRetry={() => router.push('/')} />;

  const quests = [
    { title: 'Earn 50 XP', desc: 'Complete lessons to earn XP', progress: Math.min((user.xp / 50) * 100, 100), reward: '🔥 +5 Streak' },
    { title: 'Complete 3 Lessons', desc: 'Finish 3 lessons today', progress: 33, reward: '💎 +20 Gems' },
    { title: 'Reach 100 XP', desc: 'Keep learning to hit 100 XP', progress: Math.min((user.xp / 100) * 100, 100), reward: '⭐ Achievement' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen"><Sidebar active="quests" onNavigate={handleNavigate} /></div>
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden">
              <Sidebar active="quests" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2"><Menu className="w-7 h-7 text-duo-text" /></button>
          <TopBar user={user} />
        </header>
        <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-duo-text mb-8 text-center">Daily Quests</motion.h1>
          <div className="space-y-4">
            {quests.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="duo-card p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Target className="w-7 h-7 text-duo-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-duo-text">{q.title}</div>
                    <div className="text-duo-light text-sm">{q.desc}</div>
                    <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-duo-blue rounded-full" initial={{ width: 0 }} animate={{ width: `${q.progress}%` }} transition={{ delay: i * 0.1, duration: 0.8 }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-duo-light">{q.reward}</div>
                    <div className="text-xs text-duo-light mt-1">{Math.round(q.progress)}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Owl size={100} expression="excited" />
            <p className="text-duo-light mt-4 font-bold">Complete quests to earn rewards!</p>
          </div>
        </main>
      </div>
    </div>
  );
}
