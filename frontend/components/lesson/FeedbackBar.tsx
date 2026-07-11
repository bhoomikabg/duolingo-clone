'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

interface FeedbackBarProps {
  status: 'correct' | 'wrong' | null;
  correctAnswer: string | null;
  onContinue: () => void;
}

export default function FeedbackBar({ status, correctAnswer, onContinue }: FeedbackBarProps) {
  if (!status) return null;

  const isCorrect = status === 'correct';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up
        ${isCorrect ? 'bg-duo-green-bg' : 'bg-duo-red-bg'}
        border-t-2 ${isCorrect ? 'border-duo-green' : 'border-duo-red'}
      `}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          {isCorrect ? (
            <CheckCircle2 className="w-10 h-10 text-duo-green" strokeWidth={2.5} />
          ) : (
            <XCircle className="w-10 h-10 text-duo-red" strokeWidth={2.5} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xl font-extrabold ${isCorrect ? 'text-duo-green' : 'text-duo-red'}`}
          >
            {isCorrect ? 'Nicely done!' : 'Correct solution:'}
          </p>
          {!isCorrect && correctAnswer && (
            <p className="text-duo-dark font-bold text-sm truncate">
              {correctAnswer}
            </p>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className={`duo-btn-primary flex-shrink-0 ${isCorrect ? 'bg-duo-green' : 'bg-duo-red border-duo-red-dark hover:bg-duo-red hover:border-duo-red-dark'}
            uppercase tracking-wider text-sm px-8 py-3
          `}
        >
          {isCorrect ? 'Continue' : 'Retry'}
        </button>
      </div>
    </div>
  );
}
