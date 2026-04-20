'use client';

import React from 'react';
import { FilterType } from '../types';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';

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
      <div className="glass-card rounded-[20px] p-1 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={clsx(
              "px-5 py-2 rounded-[16px] text-sm font-black transition-all active-scale",
              filter === tab.value
                ? "bg-button-gradient text-white shadow-sm"
                : "text-[var(--color-text-muted)] hover:bg-white/50 hover:text-[var(--color-text-purple)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-2 px-4 py-2 rounded-[16px] text-[var(--color-accent-coral)] text-sm font-bold bg-white/50 hover:bg-white/80 transition-colors active-scale border border-white/60 shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          クリア
        </button>
      )}
    </div>
  );
}
