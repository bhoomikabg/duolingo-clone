'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Exercise, LessonCompleteResponse } from '@/types';
import { getExercises, completeLesson } from '@/lib/api';
import LessonHeader from './LessonHeader';
import ExerciseView from './ExerciseView';
import FeedbackBar from './FeedbackBar';
import CompleteModal from './CompleteModal';

interface LessonRunnerProps {
  lessonId: number;
  initialHearts: number;
}

type FeedbackStatus = 'correct' | 'wrong' | null;

export default function LessonRunner({ lessonId, initialHearts }: LessonRunnerProps) {
  const router = useRouter();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackStatus>(null);
  const [hearts, setHearts] = useState(initialHearts);
  const [heartLossKey, setHeartLossKey] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [completeResult, setCompleteResult] = useState<LessonCompleteResponse | null>(null);

  // Fetch exercises
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getExercises(lessonId);
        if (!cancelled) {
          setExercises(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load exercises. Make sure your backend is running.');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const currentExercise = exercises[currentIndex];

  const handleSelect = useCallback(
    (answer: string) => {
      if (answered || !currentExercise) return;

      // For FILL_IN_BLANK, build up the answer word by word
      if (currentExercise.type === 'FILL_IN_BLANK' || currentExercise.type === 'TRANSLATE') {
        if (answer === '') {
          // Removing a word
          setSelectedAnswer((prev) => {
            if (!prev) return null;
            const words = prev.split(' ');
            words.pop();
            return words.length > 0 ? words.join(' ') : null;
          });
        } else {
          setSelectedAnswer((prev) => (prev ? `${prev} ${answer}` : answer));
        }
        return;
      }

      setSelectedAnswer(answer);
    },
    [answered, currentExercise],
  );

  const handleCheck = useCallback(() => {
    if (!selectedAnswer || !currentExercise || answered) return;

    const isCorrect = selectedAnswer.trim() === currentExercise.correct_answer.trim();
    setAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
      setHeartLossKey((k) => k + 1);
    }
  }, [selectedAnswer, currentExercise, answered]);

  const handleContinue = useCallback(() => {
  if (!answered) return;

  // Wrong answer -> retry same question
  if (feedback === 'wrong') {
    setSelectedAnswer(null);
    setAnswered(false);
    setFeedback(null);
    return;
  }

  // Last question
  if (currentIndex === exercises.length - 1) {
    const xpEarned = Math.max(correctCount * 10, 10);

    completeLesson(lessonId, {
      xp_earned: xpEarned,
      hearts_remaining: hearts,
    })
      .then((res) => {
        setCompleteResult(res);
        setShowComplete(true);
      })
      .catch(() => {
        setCompleteResult({
          message: 'Lesson completed.',
          xp: xpEarned,
          hearts,
          streak: 0,
        });
        setShowComplete(true);
      });

    return;
  }

  // Next question
  setCurrentIndex((prev) => prev + 1);
  setSelectedAnswer(null);
  setAnswered(false);
  setFeedback(null);
}, [
  answered,
  feedback,
  currentIndex,
  exercises.length,
  correctCount,
  hearts,
  lessonId,
]);

  const handleExit = useCallback(() => {
    router.push('/');
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl animate-bounce-gentle">🦉</div>
        <p className="font-bold text-duo-gray text-lg">Loading exercises...</p>
      </div>
    );
  }

  // Error state
  if (error || exercises.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">🦉</div>
        <h2 className="text-xl font-extrabold text-duo-dark text-center">{error ?? 'No exercises found'}</h2>
        <p className="text-duo-gray font-semibold text-sm text-center">
          Make sure your FastAPI backend is running and the endpoint
          <code className="block bg-white px-2 py-1 rounded-lg border border-duo-border-gray text-xs mt-2">
            GET /api/lessons/{lessonId}/exercises
          </code>
          returns exercises.
        </p>
        <button onClick={handleExit} className="duo-btn-primary mt-2">
          Back to Home
        </button>
      </div>
    );
  }

  const canCheck =
    selectedAnswer !== null &&
    selectedAnswer.trim() !== '' &&
    !answered;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with progress + hearts */}
      <LessonHeader
        current={currentIndex}
        total={exercises.length}
        hearts={hearts}
        onExit={handleExit}
      />

      {/* Heart loss flash */}
      <HeartLossFlash key={heartLossKey} trigger={heartLossKey} />

      {/* Exercise content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col">
        <div className="flex-1">
          <ExerciseView
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onSelect={handleSelect}
            answered={answered}
          />
        </div>

        {/* Check button — only visible when not answered */}
        {!answered && (
          <div className="pt-6 pb-4">
            <button
              onClick={handleCheck}
              disabled={!canCheck}
              className={`w-full py-4 rounded-2xl font-extrabold uppercase tracking-wider text-base transition-all duration-150
                ${canCheck
                  ? 'duo-btn-primary'
                  : 'bg-duo-gray-light text-duo-gray border-b-4 border-duo-gray cursor-not-allowed'
                }
              `}
            >
              Check
            </button>
          </div>
        )}
      </main>

      {/* Feedback bar */}
      <FeedbackBar
        status={feedback}
        correctAnswer={currentExercise?.correct_answer ?? null}
        onContinue={handleContinue}
      />

      {/* Complete modal */}
      <CompleteModal
        show={showComplete}
        xpEarned={correctCount * 10}
        result={completeResult}
        onContinue={handleExit}
      />
    </div>
  );
}

// Heart loss visual flash — animates when hearts decrease
function HeartLossFlash({ trigger }: { trigger: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!show) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-8 z-50 pointer-events-none animate-fade-in-up">
      <div className="bg-duo-red-bg border-2 border-duo-red rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
        <span className="text-2xl">💔</span>
        <span className="font-extrabold text-duo-red text-sm">-1 Heart</span>
      </div>
    </div>
  );
}
