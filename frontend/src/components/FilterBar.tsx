'use client';

import React from 'react';
import { FilterType } from '../types';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterBarProps {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  onClearCompleted: () => Promise<void>;
  hasCompleted: boolean;
}

export default function FilterBar({ filter, setFilter, onClearCompleted, hasCompleted }: FilterBarProps) {
  const tabs: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '完了' },
  ];

  return (
    <div className="hidden sm:flex items-center justify-between max-w-2xl mx-auto px-4 py-3">
      <div className="glass-card rounded-[20px] p-1 flex gap-1 bg-white/70 dark:bg-black/30 dark:border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={clsx(
              "px-5 py-2 rounded-[16px] text-sm font-black transition-all active-scale relative",
              filter === tab.value
                ? "text-white"
                : "text-color-text-muted hover:bg-white/50 dark:hover:bg-white/10 hover:text-color-text-purple dark:hover:text-white"
            )}
          >
            {filter === tab.value && (
              <motion.div
                layoutId="filter-indicator-desktop"
                className="absolute inset-0 bg-button-gradient rounded-[16px] shadow-sm z-0"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-2 px-4 py-2 rounded-[16px] text-color-accent-coral text-sm font-bold bg-white/50 dark:bg-color-surface hover:bg-white/80 dark:hover:bg-color-surface-hover transition-colors active-scale border border-white/60 dark:border-white/10 shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          クリア
        </button>
      )}
    </div>
  );
}
