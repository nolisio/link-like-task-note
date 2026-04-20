'use client';

import { useTheme } from '../lib/theme';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import React from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass-card hover-lift flex items-center justify-center p-2 rounded-full text-color-text-purple dark:text-color-primary-light active-scale"
      aria-label="テーマ切替"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ position: 'absolute' }}
      >
        <Sun size={20} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : -180,
          scale: theme === 'dark' ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Moon size={20} />
      </motion.div>
    </button>
  );
}
