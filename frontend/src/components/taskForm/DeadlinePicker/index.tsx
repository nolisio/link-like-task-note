'use client';

import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { ja } from 'date-fns/locale';

interface DeadlinePickerProps {
  value: string | null;
  onChange: (iso: string | null) => void;
}

export default function DeadlinePicker({ value, onChange }: DeadlinePickerProps) {
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const jstString = new Date(value).toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' });
    return new Date(jstString.replace(' ', 'T'));
  }, [value]);

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    
    const newDate = new Date(date);
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else {
      newDate.setHours(12, 0, 0, 0);
    }
    emitIso(newDate);
  };

  const handleTimeChange = (type: 'hour' | 'minute', val: number) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    if (type === 'hour') newDate.setHours(val);
    if (type === 'minute') newDate.setMinutes(val);
    emitIso(newDate);
  };

  const emitIso = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    
    const iso = `${yyyy}-${mm}-${dd}T${HH}:${MM}:00+09:00`;
    onChange(iso);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const currentHour = selectedDate ? selectedDate.getHours() : 12;
  const currentMinute = selectedDate ? selectedDate.getMinutes() : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-color-text-purple dark:text-color-primary-light tracking-widest">
          締切
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      <div className="bg-white/70 dark:bg-black/30 rounded-xl p-3 border border-white/50 dark:border-white/10 flex flex-col items-center overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          .rdp-root {
            --rdp-accent-color: #b08cff;
            --rdp-background-color: transparent;
          }
        `}} />
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDaySelect}
          locale={ja}
          className="text-sm font-bold text-color-text-main dark:text-white"
        />
        
        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-color-text-main/10 dark:border-white/10 w-full justify-center">
          <span className="text-xs font-black text-color-text-main dark:text-white/70">時間:</span>
            <select
              value={currentHour}
              onChange={(e) => handleTimeChange('hour', Number(e.target.value))}
              className="bg-white/90 dark:bg-black/50 rounded-lg px-2 py-1 text-sm font-bold text-color-text-main dark:text-white outline-none focus:ring-2 focus:ring-color-primary-light border border-white/50 dark:border-white/10 cursor-pointer"
              aria-label="締切の時"
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className="text-sm font-bold text-color-text-main dark:text-white">:</span>
            <select
              value={currentMinute}
              onChange={(e) => handleTimeChange('minute', Number(e.target.value))}
              className="bg-white/90 dark:bg-black/50 rounded-lg px-2 py-1 text-sm font-bold text-color-text-main dark:text-white outline-none focus:ring-2 focus:ring-color-primary-light border border-white/50 dark:border-white/10 cursor-pointer"
              aria-label="締切の分"
            >
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
      </div>
    </div>
  );
}
