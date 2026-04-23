'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Priority, RecurrenceType, RecurrenceUnit, Task } from '../../types';
import PrioritySelector from '../taskForm/PrioritySelector';
import RecurrenceSelector from '../taskForm/RecurrenceSelector';

interface TaskEditModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (id: number, updates: Partial<Task>) => Promise<void>;
}

export default function TaskEditModal({ open, task, onClose, onSubmit }: TaskEditModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('ONCE');
  const [customIntervalValue, setCustomIntervalValue] = useState<number>(1);
  const [customIntervalUnit, setCustomIntervalUnit] = useState<RecurrenceUnit>('DAY');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !task) return;
    setTitle(task.title);
    setPriority(task.priority);
    setRecurrenceType(task.recurrenceType);
    setCustomIntervalValue(task.customIntervalValue ?? 1);
    setCustomIntervalUnit(task.customIntervalUnit ?? 'DAY');
    setSubmitting(false);
  }, [open, task]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    const updates: Partial<Task> = {
      title: trimmed,
      priority,
      recurrenceType,
      customIntervalValue: recurrenceType === 'CUSTOM' ? customIntervalValue : null,
      customIntervalUnit: recurrenceType === 'CUSTOM' ? customIntervalUnit : null,
    };

    setSubmitting(true);
    try {
      await onSubmit(task.id, updates);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && task && (
        <motion.div
          key="task-edit-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-label="タスクを編集"
          onClick={onClose}
        >
          <motion.form
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="glass-card w-full max-w-md rounded-[24px] p-5 bg-white/90 dark:bg-neutral-900/90 border border-white/50 dark:border-white/10 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-color-text-main dark:text-white">タスクを編集</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-color-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-black text-color-text-purple dark:text-color-primary-light tracking-widest">
                タイトル
              </span>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/70 dark:bg-black/30 rounded-xl px-3 py-2 text-sm font-bold text-color-text-main dark:text-white outline-none focus:ring-2 focus:ring-color-primary-light border border-white/50 dark:border-white/10"
              />
            </label>

            <PrioritySelector priority={priority} onChange={setPriority} />

            <RecurrenceSelector
              recurrenceType={recurrenceType}
              customIntervalValue={customIntervalValue}
              customIntervalUnit={customIntervalUnit}
              onChangeType={setRecurrenceType}
              onChangeCustomValue={setCustomIntervalValue}
              onChangeCustomUnit={setCustomIntervalUnit}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-bold text-color-text-muted hover:bg-black/5 dark:hover:bg-white/10"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="px-4 py-2 rounded-xl text-sm font-black text-white bg-button-gradient shadow-[0_4px_12px_rgba(176,140,255,0.4)] disabled:opacity-50 disabled:grayscale active-scale"
              >
                保存
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
