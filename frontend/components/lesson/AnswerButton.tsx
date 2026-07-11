'use client';

import { Check } from 'lucide-react';

interface AnswerButtonProps {
  label: string;
  selected: boolean;
  status: 'idle' | 'correct' | 'wrong';
  disabled: boolean;
  onClick: () => void;
  index?: number;
}

const STATUS_STYLES: Record<string, string> = {
  idle: 'border-duo-border-gray border-b-4 hover:bg-duo-gray-bg hover:border-duo-gray',
  selected: 'border-duo-blue bg-duo-blue-bg border-duo-blue',
  correct: 'border-duo-green bg-duo-green-bg border-duo-green',
  wrong: 'border-duo-red bg-duo-red-bg border-duo-red',
};

const TEXT_STYLES: Record<string, string> = {
  idle: 'text-duo-dark',
  selected: 'text-duo-blue',
  correct: 'text-duo-green',
  wrong: 'text-duo-red',
};

export default function AnswerButton({
  label,
  selected,
  status,
  disabled,
  onClick,
  index,
}: AnswerButtonProps) {
  const statusKey = status !== 'idle' ? status : selected ? 'selected' : 'idle';
  const style = STATUS_STYLES[statusKey] ?? STATUS_STYLES.idle;
  const textStyle = TEXT_STYLES[statusKey] ?? TEXT_STYLES.idle;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 ${style} ${textStyle}
        font-bold text-base transition-all duration-150
        active:translate-y-[2px] active:border-b-2
        disabled:cursor-default flex items-center gap-3
        ${!disabled ? 'cursor-pointer' : ''}
      `}
    >
      {index !== undefined && (
        <span
          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-extrabold flex-shrink-0
            ${statusKey === 'idle'
              ? 'border-duo-border-gray text-duo-gray'
              : 'border-current'
            }`}
        >
          {String.fromCharCode(65 + index)}
        </span>
      )}
      <span className="flex-1">{label}</span>
      {status === 'correct' && <Check className="w-5 h-5 flex-shrink-0" strokeWidth={3} />}
    </button>
  );
}
