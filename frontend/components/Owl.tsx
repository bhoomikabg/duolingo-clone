'use client';

import { motion } from 'framer-motion';

interface OwlProps {
  size?: number;
  expression?: 'happy' | 'sad' | 'excited' | 'neutral';
  animate?: boolean;
}

export function Owl({ size = 120, expression = 'happy', animate = true }: OwlProps) {
  const eyeColor = expression === 'sad' ? '#4a4a4a' : '#3c3c3c';
  const mouthPath =
    expression === 'sad'
      ? 'M 48 92 Q 60 84 72 92'
      : expression === 'excited'
      ? 'M 46 88 Q 60 104 74 88 Q 60 96 46 88'
      : 'M 46 88 Q 60 100 74 88';

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={animate ? { y: [0, -6, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        {/* Body */}
        <ellipse cx="60" cy="72" rx="38" ry="40" fill="#58cc02" />
        <ellipse cx="60" cy="74" rx="28" ry="32" fill="#89e602" />

        {/* Wings */}
        <motion.g
          animate={animate ? { rotate: [0, -8, 8, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '22px', originY: '60px' }}
        >
          <ellipse cx="22" cy="60" rx="12" ry="22" fill="#58a700" />
        </motion.g>
        <motion.g
          animate={animate ? { rotate: [0, 8, -8, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '98px', originY: '60px' }}
        >
          <ellipse cx="98" cy="60" rx="12" ry="22" fill="#58a700" />
        </motion.g>

        {/* Head */}
        <ellipse cx="60" cy="38" rx="32" ry="28" fill="#58cc02" />

        {/* Ear tufts */}
        <path d="M 32 18 L 28 8 L 38 16 Z" fill="#58a700" />
        <path d="M 88 18 L 92 8 L 82 16 Z" fill="#58a700" />

        {/* Face mask */}
        <ellipse cx="60" cy="42" rx="24" ry="20" fill="#f7f7f7" />

        {/* Eyes */}
        <motion.g
          animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1] }}
          style={{ originX: '60px', originY: '38px' }}
        >
          <circle cx="48" cy="38" r="8" fill="white" />
          <circle cx="72" cy="38" r="8" fill="white" />
          <circle cx="48" cy="38" r="5" fill={eyeColor} />
          <circle cx="72" cy="38" r="5" fill={eyeColor} />
          <circle cx="50" cy="36" r="1.5" fill="white" />
          <circle cx="74" cy="36" r="1.5" fill="white" />
        </motion.g>

        {/* Beak */}
        <path d="M 54 54 L 66 54 L 60 64 Z" fill="#ffc800" stroke="#e6a800" strokeWidth="1" />

        {/* Mouth/expression */}
        <path d={mouthPath} stroke={expression === 'sad' ? '#ff4b4b' : '#3c3c3c'} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Cheeks for excited */}
        {expression === 'excited' && (
          <>
            <circle cx="38" cy="52" r="4" fill="#ff9bb0" opacity="0.6" />
            <circle cx="82" cy="52" r="4" fill="#ff9bb0" opacity="0.6" />
          </>
        )}

        {/* Sad tear for sad expression */}
        {expression === 'sad' && (
          <motion.path
            d="M 48 46 L 48 54"
            stroke="#1cb0f6"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ opacity: [0, 1, 0], y: [0, 6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Feet */}
        <ellipse cx="50" cy="110" rx="6" ry="3" fill="#ffc800" />
        <ellipse cx="70" cy="110" rx="6" ry="3" fill="#ffc800" />
      </svg>
    </motion.div>
  );
}
