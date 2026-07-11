'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type User } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingState, ErrorState } from '@/components/States';
import { Owl } from '@/components/Owl';

export default function ForumPage() {
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

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen"><Sidebar active="forum" onNavigate={handleNavigate} /></div>
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden">
              <Sidebar active="forum" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2"><Menu className="w-7 h-7 text-duo-text" /></button>
          <TopBar user={user} />
        </header>
        <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full text-center">
          <Owl size={120} expression="neutral" />
          <h1 className="text-3xl font-extrabold text-duo-text mt-6 mb-2">Community Forum</h1>
          <p className="text-duo-light">Connect with other learners — coming soon!</p>
        </main>
      </div>
    </div>
  );
}
