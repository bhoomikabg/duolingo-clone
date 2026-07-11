'use client';

import { useState, useEffect } from 'react';
import type { Exercise } from '@/types';
import AnswerButton from './AnswerButton';

interface ExerciseViewProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  answered: boolean;
}

export default function ExerciseView({
  exercise,
  selectedAnswer,
  onSelect,
  answered,
}: ExerciseViewProps) {
  const isFillBlank = exercise.type === 'FILL_IN_BLANK';
  const isTranslate = exercise.type === 'TRANSLATE';

  // For FILL_IN_BLANK, choices are word bank options
  // For MULTIPLE_CHOICE and TRANSLATE, choices are full answers
  const choices = exercise.choices ?? [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" key={exercise.id}>
      {/* Prompt */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-duo-gray">
          {labelForType(exercise.type)}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-duo-dark leading-snug">
          {exercise.question}
        </h2>
      </div>

      {/* Answer area */}
      {isFillBlank || isTranslate ? (
        <FillBlankView
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onSelect={onSelect}
          answered={answered}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {choices.map((choice, i) => {
            const isSelected = selectedAnswer === choice;
            const isCorrect = exercise.correct_answer === choice;
            let status: 'idle' | 'correct' | 'wrong' = 'idle';
            if (answered) {
              if (isCorrect) status = 'correct';
              else if (isSelected) status = 'wrong';
            }
            return (
              <AnswerButton
                key={`${exercise.id}-${i}`}
                label={choice}
                selected={isSelected}
                status={status}
                disabled={answered}
                onClick={() => onSelect(choice)}
                index={i}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function FillBlankView({
  
  exercise,
  selectedAnswer,
  onSelect,
  answered,
}: {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  answered: boolean;
}) {
  const [used, setUsed] = useState<Set<number>>(new Set());
  useEffect(() => {
  if (!selectedAnswer) {
    setUsed(new Set());
  }
}, [selectedAnswer]);

  const choices = exercise.choices ?? [];

  const handleBankClick = (word: string, idx: number) => {
    if (answered) return;
    if (used.has(idx)) return;
    const next = new Set(used);
    next.add(idx);
    setUsed(next);
    onSelect(word);
  };

  const handleAnswerClick = (word: string) => {
    if (answered) return;
    // Remove from used set — find the first matching unused slot
    const newUsed = new Set(used);
    for (let i = 0; i < choices.length; i++) {
      if (choices[i] === word && newUsed.has(i)) {
        newUsed.delete(i);
        break;
      }
    }
    setUsed(newUsed);
    onSelect('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Answer slots */}
      <div className="flex flex-wrap gap-2 min-h-[56px] p-3 rounded-2xl border-2 border-duo-border-gray bg-duo-gray-bg">
        {selectedAnswer ? (
          selectedAnswer.split(' ').map((word, i) => (
            <button
              key={`${word}-${i}`}
              onClick={() => handleAnswerClick(word)}
              disabled={answered}
              className="px-3 py-2 rounded-xl bg-white border-2 border-duo-border-gray border-b-4 font-bold text-duo-dark text-sm transition-all hover:border-duo-gray active:translate-y-[2px] active:border-b-2"
            >
              {word}
            </button>
          ))
        ) : (
          <span className="text-duo-gray font-semibold text-sm self-center">
            Tap words below to build your sentence
          </span>
        )}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {choices.map((word, i) => {
          const isUsed = used.has(i);
          return (
            <button
              key={`${word}-${i}`}
              onClick={() => handleBankClick(word, i)}
              disabled={isUsed || answered}
              className={`px-4 py-2.5 rounded-xl border-2 border-b-4 font-bold text-sm transition-all
                ${isUsed
                  ? 'opacity-30 border-duo-border-gray bg-duo-gray-light text-duo-gray cursor-default'
                  : 'border-duo-border-gray bg-white text-duo-dark hover:bg-duo-gray-bg hover:border-duo-gray active:translate-y-[2px] active:border-b-2 cursor-pointer'
                }
              `}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function labelForType(type: string): string {
  switch (type) {
    case 'MULTIPLE_CHOICE':
      return 'Choose the correct answer';
    case 'TRANSLATE':
      return 'Translate this sentence';
    case 'FILL_IN_BLANK':
      return 'Complete the sentence';
    default:
      return 'Question';
  }
}
