'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Owl } from '@/components/Owl';
import { DuoButton } from '@/components/DuoButton';

interface SplashScreenProps {
  onComplete: () => void;
}

const messages = [
  {
    owl: 'happy' as const,
    text: "Hello! I'm your learning buddy.",
    button: 'Continue',
  },
  {
    owl: 'neutral' as const,
    text: 'Learning every day makes a huge difference.',
    button: 'Continue',
  },
  {
    owl: 'excited' as const,
    text: 'Complete lessons. Earn XP. Protect your streak. Become amazing.',
    button: "Let's Learn!",
  },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0);
  const current = messages[step];

  const handleNext = () => {
    if (step < messages.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #e5f6ff 0%, #d7ffb8 100%)' }}
    >
      {/* Animated clouds */}
      <Clouds />
      {/* Floating stars */}
      <Stars />
      {/* Floating leaves */}
      <Leaves />

      {/* Owl */}
      <motion.div
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative z-10 mb-8"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Owl size={160} expression={current.owl} />
        </motion.div>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 bg-white rounded-3xl px-8 py-6 max-w-md mx-4 shadow-xl border-2 border-gray-100"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-2 border-t-2 border-gray-100" />
          <p className="text-xl font-bold text-duo-text text-center">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-8 flex flex-col items-center gap-3"
      >
        <DuoButton variant="primary" size="lg" onClick={handleNext}>
          {current.button}
        </DuoButton>
        <button
          onClick={onComplete}
          className="text-duo-light font-bold text-sm hover:text-duo-text transition-colors"
        >
          Skip
        </button>
      </motion.div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-duo-green' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

function Clouds() {
  const clouds = [
    { x: '10%', y: '15%', size: 80, delay: 0 },
    { x: '80%', y: '20%', size: 60, delay: 1 },
    { x: '70%', y: '60%', size: 70, delay: 2 },
    { x: '20%', y: '70%', size: 50, delay: 1.5 },
  ];
  return (
    <>
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: c.x, top: c.y }}
          animate={{ x: [0, 30, 0], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, delay: c.delay }}
        >
          <div className="flex items-end gap-1">
            <div className="w-12 h-12 bg-white rounded-full opacity-70" />
            <div className="w-16 h-16 bg-white rounded-full opacity-70" />
            <div className="w-10 h-10 bg-white rounded-full opacity-70" />
          </div>
        </motion.div>
      ))}
    </>
  );
}

function Stars() {
  const stars = Array.from({ length: 15 }, (_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 3,
  }));
  return (
    <>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300"
          style={{ left: s.x, top: s.y, fontSize: s.size }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
        >
          ⭐
        </motion.div>
      ))}
    </>
  );
}

function Leaves() {
  const leaves = Array.from({ length: 8 }, (_, i) => ({
    x: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
  }));
  return (
    <>
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="absolute text-green-400 text-2xl"
          style={{ left: l.x, top: '-5%' }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 360] }}
          transition={{ duration: l.duration, repeat: Infinity, delay: l.delay, ease: 'linear' }}
        >
          🍃
        </motion.div>
      ))}
    </>
  );
}
