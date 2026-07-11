'use client';

import { motion } from 'framer-motion';
import { Owl } from '@/components/Owl';
import { DuoButton } from '@/components/DuoButton';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Owl size={100} expression="happy" />
      </motion.div>
      <div className="text-duo-light font-bold text-lg">{message}</div>
      <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-duo-green rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
      <Owl size={120} expression="sad" />
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-duo-text mb-2">Oops!</h2>
        <p className="text-duo-light">{message}</p>
      </div>
      {onRetry && (
        <DuoButton variant="primary" size="lg" onClick={onRetry}>
          Try Again
        </DuoButton>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="duo-card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
