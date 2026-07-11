'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { api, type Exercise, type User } from '@/lib/api';
import { Owl } from '@/components/Owl';
import { DuoButton } from '@/components/DuoButton';
import { cn } from '@/lib/utils';

interface LessonPlayerProps {
  lessonId: number;
  skillName: string;
  skillIcon: string;
  user: User;
  onUserUpdate: (user: User) => void;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

export function LessonPlayer({ lessonId, skillName, skillIcon, user, onUserUpdate }: LessonPlayerProps) {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(user.hearts);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [checked, setChecked] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    api.getExercises(lessonId)
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [lessonId]);

  const currentExercise = exercises[currentIndex];

  const isCorrect = useCallback((): boolean => {
    if (!currentExercise) return false;
    if (currentExercise.type === 'TRANSLATE') {
      const answer = selectedTokens.join(' ').trim().toLowerCase();
      return answer === currentExercise.correct_answer.trim().toLowerCase();
    }
    if (currentExercise.type === 'TYPE_ANSWER') {
      return typedAnswer.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
    }
    if (currentExercise.type === 'MATCH_PAIRS') {
      return true;
    }
    return selectedAnswer?.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
  }, [currentExercise, selectedAnswer, selectedTokens, typedAnswer]);

  const handleCheck = () => {
    if (!currentExercise) return;
    const correct = isCorrect();
    if (correct) {
      setAnswerState('correct');
      setChecked(true);
      setXpEarned((x) => x + 10);
      setCorrectCount((c) => c + 1);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58cc02', '#1cb0f6', '#ffc800', '#ff9600'],
      });
    } else {
      setAnswerState('wrong');
      setChecked(true);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setShakeKey((k) => k + 1);
      if (newHearts <= 0) {
        setOutOfHearts(true);
      }
    }
  };

  const handleContinue = () => {
    if (answerState === 'wrong') {
      // Retry same question — don't advance
      setAnswerState('idle');
      setChecked(false);
      setSelectedAnswer(null);
      setSelectedTokens([]);
      setTypedAnswer('');
      return;
    }

    // Correct — advance to next question
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswerState('idle');
      setChecked(false);
      setSelectedAnswer(null);
      setSelectedTokens([]);
      setTypedAnswer('');
    } else {
      // Lesson complete
      api.completeLesson(lessonId, correctCount*10, hearts)
        .then((res) => {
          onUserUpdate({
            ...user,
            xp: res.xp,
            hearts: res.hearts,
            streak: res.streak,
          });
          setShowComplete(true);
        })
        .catch(() => {
          setShowComplete(true);
        });
    }
  };

  if (loading) return <LessonLoading />;
  if (error) return <LessonError message={error || undefined} onRetry={() => router.push('/')} />;
  if (outOfHearts && !showComplete) return <OutOfHearts onHome={() => router.push('/')} />;
  if (showComplete) return <LessonComplete xpEarned={xpEarned} correctCount={correctCount} totalCount={exercises.length} onHome={() => router.push('/')} />;

  if (!currentExercise) return null;

  const progress = ((currentIndex+1) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 sm:px-8 py-4 max-w-2xl mx-auto w-full">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600">
          <X className="w-8 h-8" />
        </button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-duo-green rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex items-center gap-1.5 font-bold text-duo-red">
          <Heart className="w-7 h-7" fill="currentColor" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>

      {/* Exercise content */}
      <motion.div
        key={shakeKey}
        animate={answerState === 'wrong' ? { x: [-10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col px-4 sm:px-8 max-w-2xl mx-auto w-full pt-8"
      >
        <ExerciseContent
          exercise={currentExercise}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
          selectedTokens={selectedTokens}
          onSelectToken={setSelectedTokens}
          typedAnswer={typedAnswer}
          onTypeAnswer={setTypedAnswer}
          checked={checked}
          answerState={answerState}
        />
      </motion.div>

      {/* Footer bar */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'border-t-4 px-4 sm:px-8 py-6',
              answerState === 'correct' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            )}
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  answerState === 'correct' ? 'bg-green-500' : 'bg-red-500'
                )}>
                  {answerState === 'correct' ? (
                    <Check className="w-7 h-7 text-white" strokeWidth={4} />
                  ) : (
                    <X className="w-7 h-7 text-white" strokeWidth={4} />
                  )}
                </div>
                <div>
                  <div className={cn('font-extrabold text-lg', answerState === 'correct' ? 'text-green-600' : 'text-red-500')}>
                    {answerState === 'correct' ? 'Correct!' : 'Correct solution:'}
                  </div>
                  {answerState === 'wrong' && (
                    <div className="text-duo-text font-bold">{currentExercise.correct_answer}</div>
                  )}
                </div>
              </div>
              <DuoButton
                variant={answerState === 'correct' ? 'primary' : 'red'}
                size="lg"
                onClick={handleContinue}
              >
                {answerState === 'correct' ? 'Continue' : 'Retry'}
              </DuoButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check button when not checked */}
      {!checked && (
        <div className="border-t-2 border-gray-100 px-4 sm:px-8 py-4">
          <div className="max-w-2xl mx-auto">
            <DuoButton
              variant={canCheck(currentExercise, selectedAnswer, selectedTokens, typedAnswer) ? 'primary' : 'gray'}
              size="lg"
              className="w-full"
              onClick={handleCheck}
              disabled={!canCheck(currentExercise, selectedAnswer, selectedTokens, typedAnswer)}
            >
              Check
            </DuoButton>
          </div>
        </div>
      )}
    </div>
  );
}

function canCheck(exercise: Exercise, selectedAnswer: string | null, selectedTokens: string[], typedAnswer: string): boolean {
  if (exercise.type === 'TRANSLATE') return selectedTokens.length > 0;
  if (exercise.type === 'TYPE_ANSWER') return typedAnswer.trim().length > 0;
  if (exercise.type === 'MATCH_PAIRS') return false;
  return selectedAnswer !== null;
}

function ExerciseContent({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  selectedTokens,
  onSelectToken,
  typedAnswer,
  onTypeAnswer,
  checked,
  answerState,
}: {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelectAnswer: (a: string) => void;
  selectedTokens: string[];
  onSelectToken: (tokens: string[]) => void;
  typedAnswer: string;
  onTypeAnswer: (s: string) => void;
  checked: boolean;
  answerState: AnswerState;
}) {
  if (exercise.type === 'MULTIPLE_CHOICE') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-duo-text mb-1">Select the correct answer</h2>
          <p className="text-duo-light text-lg">{exercise.question}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exercise.choices.map((choice, i) => {
            const isSelected = selectedAnswer === choice;
            const isCorrectChoice = choice === exercise.correct_answer;
            let className = 'duo-option';
            if (checked) {
              if (isCorrectChoice) className += ' duo-option-correct';
              else if (isSelected) className += ' duo-option-wrong';
            } else if (isSelected) {
              className += ' duo-option-selected';
            }
            return (
              <motion.button
                key={i}
                whileHover={!checked ? { scale: 1.02 } : {}}
                onClick={() => !checked && onSelectAnswer(choice)}
                className={className}
              >
                <span className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-duo-light">
                  {i + 1}
                </span>
                <span className="font-bold text-duo-text text-lg">{choice}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (exercise.type === 'TRANSLATE') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-duo-text mb-1">{exercise.question}</h2>
        </div>
        {/* Answer area */}
        <div className="min-h-[80px] flex flex-wrap gap-2 p-4 rounded-2xl border-2 border-gray-200 bg-gray-50">
          {selectedTokens.map((token, i) => (
            <span key={i} className="duo-chip duo-chip-selected">{token}</span>
          ))}
        </div>
        {/* Word bank */}
        <div className="flex flex-wrap gap-2">
          {exercise.choices.map((choice, i) => {
            const used = selectedTokens.includes(choice);
            return (
              <motion.button
                key={i}
                whileHover={!used ? { scale: 1.05 } : {}}
                whileTap={!used ? { scale: 0.95 } : {}}
                disabled={used}
                onClick={() => {
                  if (!used) onSelectToken([...selectedTokens, choice]);
                }}
                className={cn('duo-chip', used && 'duo-chip-disabled')}
              >
                {choice}
              </motion.button>
            );
          })}
        </div>
        {/* Remove last token button */}
        {selectedTokens.length > 0 && !checked && (
          <button
            onClick={() => onSelectToken(selectedTokens.slice(0, -1))}
            className="text-duo-blue font-bold text-sm underline"
          >
            Remove last word
          </button>
        )}
      </div>
    );
  }

  if (exercise.type === 'FILL_IN_BLANK') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-duo-text mb-1">Fill in the blank</h2>
        </div>
        <div className="text-2xl font-bold text-duo-text py-4">
          {exercise.question.split('______').length > 1 ? (
            <>
              {exercise.question.split('______')[0]}
              <span className={cn(
                'inline-block min-w-[120px] px-4 py-1 mx-1 rounded-xl border-2',
                selectedAnswer ? 'border-duo-blue bg-blue-50' : 'border-gray-200 bg-gray-50'
              )}>
                {selectedAnswer || '___'}
              </span>
              {exercise.question.split('______')[1]}
            </>
          ) : exercise.question}
        </div>
        <div className="grid grid-cols-1 gap-3">
          {exercise.choices.map((choice, i) => {
            const isSelected = selectedAnswer === choice;
            const isCorrectChoice = choice === exercise.correct_answer;
            let className = 'duo-option';
            if (checked) {
              if (isCorrectChoice) className += ' duo-option-correct';
              else if (isSelected) className += ' duo-option-wrong';
            } else if (isSelected) {
              className += ' duo-option-selected';
            }
            return (
              <motion.button
                key={i}
                whileHover={!checked ? { scale: 1.02 } : {}}
                onClick={() => !checked && onSelectAnswer(choice)}
                className={className}
              >
                <span className="font-bold text-duo-text text-lg">{choice}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (exercise.type === 'TYPE_ANSWER') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-duo-text mb-1">Type the answer in English</h2>
          <p className="text-duo-light text-lg">{exercise.question}</p>
        </div>
        <input
          type="text"
          value={typedAnswer}
          onChange={(e) => onTypeAnswer(e.target.value)}
          disabled={checked}
          autoFocus
          placeholder="Type your answer..."
          className={cn(
            'w-full px-4 py-4 rounded-2xl border-2 text-lg font-bold text-duo-text outline-none transition-colors',
            checked
              ? answerState === 'correct'
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-gray-200 focus:border-duo-blue'
          )}
        />
      </div>
    );
  }

  // MATCH_PAIRS (fallback to multiple choice style)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-duo-text">{exercise.question}</h2>
      <div className="grid grid-cols-1 gap-3">
        {exercise.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onSelectAnswer(choice)}
            className="duo-option"
          >
            <span className="font-bold text-duo-text text-lg">{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LessonLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-white">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Owl size={120} expression="happy" />
      </motion.div>
      <div className="text-duo-light font-bold text-lg">Loading your lesson...</div>
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

function LessonError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4">
      <Owl size={120} expression="sad" />
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-duo-text mb-2">Oops! Something went wrong</h2>
        <p className="text-duo-light">{message}</p>
      </div>
      <DuoButton variant="primary" size="lg" onClick={onRetry}>Go Home</DuoButton>
    </div>
  );
}

function OutOfHearts({ onHome }: { onHome: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-white px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <Owl size={140} expression="sad" />
      </motion.div>
      <motion.div
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Heart className="w-20 h-20 text-gray-300" fill="#e5e5e5" />
      </motion.div>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-duo-text mb-2">You ran out of hearts!</h2>
        <p className="text-duo-light text-lg">Practice to earn more hearts and keep learning.</p>
      </div>
      <div className="flex gap-3">
        <DuoButton variant="primary" size="lg" onClick={onHome}>Return Home</DuoButton>
      </div>
    </div>
  );
}

function LessonComplete({
  xpEarned,
  correctCount,
  totalCount,
  onHome,
}: {
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  onHome: () => void;
}) {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ['#58cc02', '#1cb0f6', '#ffc800'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ['#58cc02', '#1cb0f6', '#ffc800'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4 py-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <Owl size={140} expression="excited" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-duo-yellow"
        style={{ color: '#ffc800' }}
      >
        Lesson Complete!
      </motion.h2>

      <div className="w-full max-w-md space-y-4 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="duo-card p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">⚡</div>
            <span className="font-extrabold text-duo-text text-lg">XP Earned</span>
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-3xl font-extrabold text-amber-500"
          >
            +{xpEarned}
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="duo-card p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
            <span className="font-extrabold text-duo-text text-lg">Accuracy</span>
          </div>
          <span className="text-3xl font-extrabold text-duo-green">{accuracy}%</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="duo-card p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">🎯</div>
            <span className="font-extrabold text-duo-text text-lg">Correct</span>
          </div>
          <span className="text-3xl font-extrabold text-duo-blue">{correctCount}/{totalCount}</span>
        </motion.div>
      </div>

      <DuoButton variant="primary" size="lg" className="mt-6 w-full max-w-md" onClick={onHome}>
        Continue
      </DuoButton>
    </div>
  );
}
