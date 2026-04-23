'use client';

import React from 'react';
import { Priority } from '../../types';

interface PrioritySelectorProps {
  priority: Priority;
  onChange: (next: Priority) => void;
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'HIGH', label: '高' },
  { value: 'MEDIUM', label: '中' },
  { value: 'LOW', label: '低' },
];

export default function PrioritySelector({ priority, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-black text-color-text-purple dark:text-color-primary-light tracking-widest">
        優先度
      </span>
      <div className="grid grid-cols-3 gap-2">
        {priorityOptions.map((opt) => {
          const active = priority === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={
                'rounded-xl px-3 py-2 text-sm font-bold transition-all active-scale ' +
                (active
                  ? 'bg-button-gradient text-white shadow-[0_4px_12px_rgba(176,140,255,0.4)]'
                  : 'bg-white/70 dark:bg-black/30 text-color-text-main dark:text-white border border-white/50 dark:border-white/10')
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
