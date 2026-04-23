'use client';

import React from 'react';
import { RecurrenceType, RecurrenceUnit } from '../../types';

interface RecurrenceBadgeProps {
  recurrenceType: RecurrenceType;
  customIntervalValue: number | null;
  customIntervalUnit: RecurrenceUnit | null;
}

const unitLabel: Record<RecurrenceUnit, string> = {
  DAY: '日',
  WEEK: '週',
  MONTH: '月',
};

const typePresentation: Record<Exclude<RecurrenceType, 'ONCE' | 'CUSTOM'>, { icon: string; label: string }> = {
  DAILY: { icon: '🔄', label: '毎日' },
  WEEKLY: { icon: '📅', label: '毎週' },
  MONTHLY: { icon: '🗓️', label: '毎月' },
};

export default function RecurrenceBadge({
  recurrenceType,
  customIntervalValue,
  customIntervalUnit,
}: RecurrenceBadgeProps) {
  if (recurrenceType === 'ONCE') return null;

  if (recurrenceType === 'CUSTOM') {
    if (customIntervalValue == null || customIntervalUnit == null) return null;
    return (
      <span
        className="text-[10px] font-black px-2 py-0.5 rounded-full bg-color-primary-light/30 dark:bg-color-primary-light/20 text-color-text-purple dark:text-color-primary-light tracking-wide"
        aria-label={`${customIntervalValue}${unitLabel[customIntervalUnit]}毎に繰り返し`}
      >
        ⏱ {customIntervalValue}{unitLabel[customIntervalUnit]}毎
      </span>
    );
  }

  const preset = typePresentation[recurrenceType];
  return (
    <span
      className="text-[10px] font-black px-2 py-0.5 rounded-full bg-color-primary-light/30 dark:bg-color-primary-light/20 text-color-text-purple dark:text-color-primary-light tracking-wide"
      aria-label={preset.label}
    >
      {preset.icon} {preset.label}
    </span>
  );
}
