'use client';

import React from 'react';
import { RecurrenceType, RecurrenceUnit } from '../../types';

interface RecurrenceSelectorProps {
  recurrenceType: RecurrenceType;
  customIntervalValue: number;
  customIntervalUnit: RecurrenceUnit;
  onChangeType: (next: RecurrenceType) => void;
  onChangeCustomValue: (next: number) => void;
  onChangeCustomUnit: (next: RecurrenceUnit) => void;
}

const typeOptions: { value: RecurrenceType; label: string }[] = [
  { value: 'ONCE', label: '一回のみ' },
  { value: 'DAILY', label: '毎日' },
  { value: 'WEEKLY', label: '毎週' },
  { value: 'MONTHLY', label: '毎月' },
  { value: 'CUSTOM', label: 'カスタム' },
];

const unitOptions: { value: RecurrenceUnit; label: string }[] = [
  { value: 'DAY', label: '日' },
  { value: 'WEEK', label: '週' },
  { value: 'MONTH', label: '月' },
];

export default function RecurrenceSelector({
  recurrenceType,
  customIntervalValue,
  customIntervalUnit,
  onChangeType,
  onChangeCustomValue,
  onChangeCustomUnit,
}: RecurrenceSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-black text-color-text-purple dark:text-color-primary-light tracking-widest">
        繰り返し
      </label>
      <div className="grid grid-cols-5 gap-2">
        {typeOptions.map((opt) => {
          const active = recurrenceType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeType(opt.value)}
              aria-pressed={active}
              className={
                'rounded-xl px-2 py-2 text-xs font-bold transition-all active-scale ' +
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

      {recurrenceType === 'CUSTOM' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={customIntervalValue}
            onChange={(e) => onChangeCustomValue(Math.max(1, Number(e.target.value) || 1))}
            className="w-20 bg-white/70 dark:bg-black/30 rounded-xl px-3 py-2 text-sm font-bold text-color-text-main dark:text-white outline-none focus:ring-2 focus:ring-color-primary-light border border-white/50 dark:border-white/10"
            aria-label="カスタム間隔の数値"
          />
          <select
            value={customIntervalUnit}
            onChange={(e) => onChangeCustomUnit(e.target.value as RecurrenceUnit)}
            className="bg-white/70 dark:bg-black/30 rounded-xl px-3 py-2 text-sm font-bold text-color-text-main dark:text-white outline-none focus:ring-2 focus:ring-color-primary-light border border-white/50 dark:border-white/10"
            aria-label="カスタム間隔の単位"
          >
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}毎
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
