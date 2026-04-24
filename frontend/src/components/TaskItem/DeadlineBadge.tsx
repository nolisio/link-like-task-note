'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DeadlineBadgeProps {
  dueDate: string | null;
  completed?: boolean;
}

export default function DeadlineBadge({ dueDate, completed = false }: DeadlineBadgeProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  if (!dueDate) return null;

  const date = new Date(dueDate);
  const isOverdue = now !== null && !completed && date.getTime() < now;
  
  const jstString = date.toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' });
  const jstDate = new Date(jstString.replace(' ', 'T'));
  const formatted = format(jstDate, 'M/d(E) HH:mm', { locale: ja });

  if (isOverdue) {
    return (
      <span
        className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white tracking-wide"
        aria-label={`締切: ${formatted} (期限切れ)`}
      >
        ⚠️ {formatted}
      </span>
    );
  }

  return (
    <span
      className="text-[10px] font-black px-2 py-0.5 rounded-full bg-color-primary-light/30 dark:bg-color-primary-light/20 text-color-text-purple dark:text-color-primary-light tracking-wide"
      aria-label={`締切: ${formatted}`}
    >
      📅 {formatted}
    </span>
  );
}
