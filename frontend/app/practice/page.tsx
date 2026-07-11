'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Dumbbell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type User } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingState, ErrorState } from '@/components/States';
import { DuoButton } from '@/components/DuoButton';
import { Owl } from '@/components/Owl';

export default function PracticePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.getUser()
      .then((u) => { setUser(u); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleNavigate = (route: string) => { setSidebarOpen(false); router.push(route); };

  if (loading) return <div className="min-h-screen bg-white"><LoadingState /></div>;
  if (error || !user) return <ErrorState message={error || undefined} onRetry={() => router.push('/')} />;

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen"><Sidebar active="practice" onNavigate={handleNavigate} /></div>
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden">
              <Sidebar active="practice" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Owl size={120} expression="happy" />
            <h1 className="text-3xl font-extrabold text-duo-text mt-6 mb-2">Practice Hub</h1>
            <p className="text-duo-light mb-8">Sharpen your skills with targeted practice</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Review Words', icon: '📖', desc: 'Practice vocabulary you\'ve learned', color: 'bg-blue-50' },
                { title: 'Practice Sentences', icon: '💬', desc: 'Build sentences from words', color: 'bg-green-50' },
                { title: 'Listening Practice', icon: '👂', desc: 'Improve your listening skills', color: 'bg-purple-50' },
                { title: 'Speaking Practice', icon: '🗣️', desc: 'Perfect your pronunciation', color: 'bg-orange-50' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className={`duo-card p-6 cursor-pointer ${item.color}`}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="font-extrabold text-duo-text text-lg">{item.title}</div>
                  <div className="text-duo-light text-sm mt-1">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
