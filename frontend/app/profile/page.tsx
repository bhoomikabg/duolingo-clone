'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Flame, Heart, Star, Gem, Trophy, Target, Zap, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type User, type PathSection } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingState, ErrorState } from '@/components/States';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [path, setPath] = useState<PathSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [u, p] = await Promise.all([api.getUser(), api.getPath()]);
      setUser(u);
      setPath(p);
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

  if (loading) return <div className="min-h-screen bg-white"><LoadingState message="Loading profile..." /></div>;
  if (error || !user) return <ErrorState message={error || undefined} onRetry={fetchData} />;

  const allSkills = path.flatMap((s) => s.skills);
  const completedSkills = allSkills.filter((s) => s.completed);
  const totalLessons = allSkills.reduce((sum, s) => sum + s.lessons.length, 0);
  const completedLessons = allSkills.reduce((sum, s) => sum + s.lessons.filter((l) => l.completed).length, 0);

  const stats = [
    { icon: Flame, label: 'Day Streak', value: user.streak, color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Star, label: 'Total XP', value: user.xp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Heart, label: 'Hearts', value: user.hearts, color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Gem, label: 'Gems', value: user.gems, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const achievements = [
    { icon: Flame, label: 'Wildfire', desc: 'Reach a 3 day streak', unlocked: user.streak >= 3, color: 'text-orange-500' },
    { icon: Zap, label: 'Sharpshooter', desc: 'Earn 100 XP', unlocked: user.xp >= 100, color: 'text-amber-500' },
    { icon: Trophy, label: 'Champion', desc: 'Reach top 3 in leaderboard', unlocked: false, color: 'text-yellow-500' },
    { icon: Award, label: 'Scholar', desc: 'Complete 5 lessons', unlocked: completedLessons >= 5, color: 'text-purple-500' },
    { icon: Target, label: 'Goal Getter', desc: 'Complete your first skill', unlocked: completedSkills.length > 0, color: 'text-green-500' },
    { icon: Gem, label: 'Collector', desc: 'Earn 500 gems', unlocked: user.gems >= 500, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar active="profile" onNavigate={handleNavigate} />
        </div>
      </div>

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
              <Sidebar active="profile" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
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
          {/* Profile header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="duo-card p-6 mb-6 flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-duo-blue flex items-center justify-center text-white font-extrabold text-4xl border-4 border-blue-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-duo-text">{user.name}</h1>
              <p className="text-duo-light font-bold mt-1">Joined recently</p>
              <div className="flex gap-4 mt-3 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 font-bold text-orange-500">
                  <Flame className="w-5 h-5" fill="currentColor" /> {user.streak}
                </div>
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <Star className="w-5 h-5" fill="currentColor" /> {user.xp}
                </div>
                <div className="flex items-center gap-1.5 font-bold text-blue-500">
                  <Gem className="w-5 h-5" fill="currentColor" /> {user.gems}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="duo-card p-4 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} fill="currentColor" />
                  </div>
                  <div className="text-2xl font-extrabold text-duo-text">{stat.value}</div>
                  <div className="text-xs text-duo-light font-bold uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Daily goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="duo-card p-6 mb-6"
          >
            <h2 className="font-extrabold text-duo-text text-lg mb-4">Daily Goal</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500" fill="currentColor" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-duo-text">50 XP per day</div>
                <div className="text-duo-light text-sm mb-2">You've earned {user.xp} XP total</div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.xp / 50) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="duo-card p-6 mb-6"
          >
            <h2 className="font-extrabold text-duo-text text-lg mb-4">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map((ach, i) => {
                const Icon = ach.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-2xl border-2 text-center ${ach.unlocked ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-2">
                      <Icon className={`w-6 h-6 ${ach.unlocked ? ach.color : 'text-gray-400'}`} fill="currentColor" />
                    </div>
                    <div className="font-bold text-duo-text text-sm">{ach.label}</div>
                    <div className="text-xs text-duo-light mt-1">{ach.desc}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="duo-card p-6"
          >
            <h2 className="font-extrabold text-duo-text text-lg mb-4">Recent Skills</h2>
            <div className="space-y-3">
              {allSkills.slice(0, 5).map((skill, i) => (
                <div key={skill.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="text-3xl">{skill.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-duo-text">{skill.name}</div>
                    <div className="text-xs text-duo-light">
                      {skill.lessons.filter((l) => l.completed).length} / {skill.lessons.length} lessons
                    </div>
                    {skill.lessons.length > 0 && (
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <motion.div
                          className="h-full bg-duo-green rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(skill.lessons.filter((l) => l.completed).length / skill.lessons.length) * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                      </div>
                    )}
                  </div>
                  {skill.completed && (
                    <Trophy className="w-6 h-6 text-duo-gold" fill="currentColor" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
