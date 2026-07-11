'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'blue' | 'red' | 'white' | 'gray';

interface DuoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

const variantClass: Record<Variant, string> = {
  primary: 'duo-btn duo-btn-primary',
  blue: 'duo-btn duo-btn-blue',
  red: 'duo-btn duo-btn-red',
  white: 'duo-btn duo-btn-white',
  gray: 'duo-btn duo-btn-gray',
};

const sizeClass = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function DuoButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: DuoButtonProps) {
  return (
    <motion.button
      whileTap={{ y: 2 }}
      transition={{ duration: 0.05 }}
      className={cn(variantClass[variant], sizeClass[size], className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
