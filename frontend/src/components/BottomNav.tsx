'use client';

import React from 'react';
import { FilterType } from '../types';
import { ListTodo, List, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface BottomNavProps {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
}

export default function BottomNav({ filter, setFilter }: BottomNavProps) {
  const tabs = [
    { value: 'all' as FilterType, label: 'すべて', icon: List },
    { value: 'active' as FilterType, label: '進行中', icon: ListTodo },
    { value: 'completed' as FilterType, label: '完了', icon: CheckCircle2 },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2 bg-white/70 backdrop-blur-xl border-t border-white/60 shadow-[0_-4px_24px_rgba(150,130,200,0.1)]">
      <div className="flex justify-around items-center max-w-[420px] mx-auto pb-4">
        {tabs.map((tab) => {
          const isActive = filter === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className="flex flex-col items-center justify-center w-16 gap-1 active-scale transition-transform"
            >
              <div className={clsx(
                "w-12 h-10 rounded-[16px] flex items-center justify-center transition-all duration-300",
                isActive ? "bg-button-gradient text-white shadow-[0_2px_8px_rgba(176,140,255,0.4)]" : "text-[var(--color-text-muted)]"
              )}>
                <Icon className={clsx("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
              </div>
              <span className={clsx(
                "text-[10px] font-black transition-colors duration-300",
                isActive ? "text-[var(--color-primary-dark)]" : "text-[var(--color-text-muted)]"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
