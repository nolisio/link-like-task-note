'use client';

import React, { useState } from 'react';
import { Task, Priority } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import RecurrenceBadge from './RecurrenceBadge';
import DeadlineBadge from './DeadlineBadge';
import Sparkles from './Sparkles';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

const priorityColors: Record<Priority, string> = {
  HIGH: 'var(--color-priority-high)',
  MEDIUM: 'var(--color-priority-medium)',
  LOW: 'var(--color-priority-low)',
};

const priorityLabels: Record<Priority, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

export default function TaskItem({ task, onUpdate, onDelete, onEdit }: TaskItemProps) {
  const [loading, setLoading] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = async () => {
    if (!task.completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 1000);
    }
    setLoading(true);
    try {
      await onUpdate(task.id, { completed: !task.completed });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={clsx(
        'glass-card rounded-[16px] overflow-hidden flex flex-col mb-3 transition-colors duration-300 relative',
        task.completed ? 'bg-white/40 dark:bg-black/20' : 'bg-white/65 dark:bg-white/5'
      )}
      style={{
        boxShadow: `inset 4px 0 0 ${priorityColors[task.priority]}, 0 4px 12px rgba(0,0,0,0.1)`,
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="relative">
          <button
            onClick={handleToggle}
            disabled={loading}
            className={clsx(
              'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 active-scale shadow-sm',
              task.completed
                ? 'bg-button-gradient border-transparent'
                : 'border-color-primary-light dark:border-white/30 bg-white/50 dark:bg-black/30 hover:bg-color-primary-light/20 dark:hover:bg-white/10'
            )}
          >
            <AnimatePresence>
              {task.completed && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          {justCompleted && <Sparkles />}
        </div>

        <div
          className="flex-1 flex flex-col justify-center min-w-0 cursor-pointer"
          onDoubleClick={() => onEdit(task)}
        >
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full text-white tracking-widest shadow-sm"
              style={{ backgroundColor: priorityColors[task.priority] }}
            >
              {priorityLabels[task.priority]}
            </span>
            <RecurrenceBadge
              recurrenceType={task.recurrenceType}
              customIntervalValue={task.customIntervalValue}
              customIntervalUnit={task.customIntervalUnit}
            />
            <DeadlineBadge dueDate={task.dueDate} completed={task.completed} />
          </div>

          <p
            className={clsx(
              'text-sm font-bold truncate transition-all duration-300',
              task.completed ? 'text-color-text-muted line-through opacity-70' : 'text-color-text-main'
            )}
          >
            {task.title}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            aria-label="タスクを編集"
            className="p-2 text-color-text-muted hover:text-color-text-purple dark:hover:text-color-primary-light transition-colors rounded-full hover:bg-white/50 dark:hover:bg-white/10"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            aria-label="タスクを削除"
            className="p-2 text-color-text-muted hover:text-color-accent-coral transition-colors rounded-full hover:bg-white/50 dark:hover:bg-white/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
