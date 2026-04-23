'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskInputProps {
  onOpenCreate: () => void;
}

export default function TaskInput({ onOpenCreate }: TaskInputProps) {
  return (
    <div className="px-4 py-4 flex items-center gap-2 max-w-2xl mx-auto w-full">
      <button
        type="button"
        onClick={onOpenCreate}
        className="flex-1 glass-card rounded-[20px] p-3 flex items-center gap-3 bg-white/70 dark:bg-black/30 dark:border-white/10 text-left hover-lift transition-shadow"
      >
        <span className="w-9 h-9 rounded-[14px] bg-button-gradient flex items-center justify-center text-white shadow-[0_4px_12px_rgba(176,140,255,0.4)]">
          <Plus className="w-5 h-5 stroke-[3]" />
        </span>
        <span className="text-sm font-bold text-color-text-muted dark:text-color-text-muted/80">
          新しいタスクを追加...
        </span>
      </button>

      <motion.button
        type="button"
        onClick={onOpenCreate}
        whileTap={{ scale: 0.9 }}
        className="sm:hidden w-[52px] h-[52px] shrink-0 rounded-[20px] bg-button-gradient shadow-[0_4px_12px_rgba(176,140,255,0.4)] flex items-center justify-center text-white hover-lift"
        aria-label="タスクを追加"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </motion.button>
    </div>
  );
}
