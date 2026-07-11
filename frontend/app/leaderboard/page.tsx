'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type LeaderboardEntry, type User } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingState, ErrorState } from '@/components/States';
import { AnimatePresence } from 'framer-motion';

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [lb, u] = await Promise.all([api.getLeaderboard(), api.getUser()]);
      setEntries(lb);
      setUser(u);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleNavigate = (route: string) => {
    setSidebarOpen(false);
    router.push(route);
  };

  if (loading) return <div className="min-h-screen bg-white"><LoadingState message="Loading leaderboard..." /></div>;
  if (error || !user) return <ErrorState message={error || undefined} onRetry={fetchData} />;

  const sorted = [...entries].sort((a, b) => b.xp - a.xp);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const [first, second, third] = podium;

  const medalColors = ['from-yellow-400 to-yellow-500', 'from-gray-300 to-gray-400', 'from-orange-400 to-orange-500'];
  const podiumOrder = [second, first, third]; // visual order: 2nd, 1st, 3rd
  const podiumHeights = ['h-24', 'h-36', 'h-20'];
  const podiumRanks = [2, 1, 3];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar active="leaderboard" onNavigate={handleNavigate} />
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
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden"
            >
              <Sidebar active="leaderboard" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2">
            <Menu className="w-7 h-7 text-duo-text" />
          </button>
          <TopBar user={user} />
        </header>

        <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-duo-text text-center mb-8"
          >
            Leaderboard
          </motion.h1>

          {/* Podium */}
          <div className="flex items-end justify-center gap-4 mb-8">
            {podiumOrder.map((entry, i) => {
              if (!entry) return null;
              const rank = podiumRanks[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-b ${medalColors[rank - 1]} flex items-center justify-center text-white font-extrabold text-xl mb-2 border-4 border-white shadow-lg`}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-bold text-duo-text text-sm mb-1">{entry.name}</div>
                  <div className="text-duo-light text-xs font-bold mb-2">{entry.xp} XP</div>
                  <div className={`${podiumHeights[i]} w-20 sm:w-24 rounded-t-2xl bg-gradient-to-b ${medalColors[rank - 1]} flex items-center justify-center`}>
                    {rank === 1 && <Crown className="w-8 h-8 text-white" fill="white" />}
                    {rank !== 1 && <span className="text-white font-extrabold text-2xl">{rank}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rest of leaderboard */}
          <div className="space-y-2">
            {rest.map((entry, i) => {
              const rank = i + 4;
              const isCurrentUser = entry.name === user.name;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${isCurrentUser ? 'border-duo-blue bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="w-8 text-center font-extrabold text-duo-light">{rank}</div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-duo-text">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 font-bold text-duo-text">{entry.name}</div>
                  <div className="font-extrabold text-duo-blue">{entry.xp} XP</div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
