'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Palette, Globe, Bell, Info, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type User } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingState, ErrorState } from '@/components/States';
import { DuoButton } from '@/components/DuoButton';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const fetchData = async () => {
    try {
      const u = await api.getUser();
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

  if (loading) return <div className="min-h-screen bg-white"><LoadingState message="Loading settings..." /></div>;
  if (error || !user) return <ErrorState message={error || undefined} onRetry={fetchData} />;

  type SettingItem = {
    icon: typeof Palette;
    label: string;
    value: string;
    desc: string;
    toggle?: boolean;
    action?: boolean;
  };
  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: 'Theme', value: 'Light', desc: 'Choose your theme' },
        { icon: Globe, label: 'Language', value: 'English', desc: 'App interface language' },
        { icon: Bell, label: 'Notifications', value: notifications ? 'On' : 'Off', desc: 'Daily reminders', toggle: true },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'About DuoLearn', value: 'v1.0.0', desc: 'Learn languages with fun' },
        { icon: LogOut, label: 'Log Out', value: '', desc: 'Sign out of your account', action: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden md:block w-64 border-r-2 border-gray-100 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar active="settings" onNavigate={handleNavigate} />
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
              <Sidebar active="settings" onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} mobile />
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

        <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-duo-text mb-8"
          >
            Settings
          </motion.h1>

          {sections.map((section, sIdx) => (
            <motion.div
              key={sIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="mb-8"
            >
              <h2 className="text-duo-light font-extrabold text-sm uppercase tracking-wide mb-3 px-2">{section.title}</h2>
              <div className="duo-card overflow-hidden">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 ${i < section.items.length - 1 ? 'border-b-2 border-gray-100' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-duo-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-duo-text">{item.label}</div>
                        <div className="text-xs text-duo-light">{item.desc}</div>
                      </div>
                      {item.toggle ? (
                        <button
                          onClick={() => setNotifications(!notifications)}
                          className={`w-12 h-7 rounded-full transition-colors relative ${notifications ? 'bg-duo-green' : 'bg-gray-300'}`}
                        >
                          <motion.div
                            layout
                            className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow"
                            animate={{ x: notifications ? 22 : 2 }}
                          />
                        </button>
                      ) : item.action ? (
                        <DuoButton variant="red" size="sm">Log Out</DuoButton>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-duo-light font-bold text-sm">{item.value}</span>
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </main>
      </div>
    </div>
  );
}
