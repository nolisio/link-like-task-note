'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';
import clsx from 'clsx';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
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

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onUpdate(task.id, { completed: !task.completed });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }
    
    setLoading(true);
    try {
      await onUpdate(task.id, { title: editTitle });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
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
        "glass-card rounded-[16px] overflow-hidden flex flex-col mb-3 transition-colors duration-300",
        task.completed ? "bg-white/40" : "bg-white/65"
      )}
      style={{
        boxShadow: `inset 4px 0 0 ${priorityColors[task.priority]}, 0 4px 12px rgba(150,130,200,0.1)`,
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={clsx(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 active-scale shadow-sm",
            task.completed
              ? "bg-button-gradient border-transparent"
              : "border-[var(--color-primary-light)] bg-white/50 hover:bg-[var(--color-primary-light)]/20"
          )}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-5 h-5 text-white stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1 flex flex-col justify-center min-w-0" onDoubleClick={() => setIsEditing(true)}>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-[10px] font-black px-2 py-0.5 rounded-full text-white tracking-widest shadow-sm"
              style={{ backgroundColor: priorityColors[task.priority] }}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
          
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-full bg-white/80 rounded-lg px-2 py-1 text-sm font-bold text-[var(--color-text-main)] outline-none ring-2 ring-[var(--color-primary-light)]"
            />
          ) : (
            <p className={clsx(
              "text-sm font-bold truncate transition-all duration-300",
              task.completed ? "text-[var(--color-text-muted)] line-through opacity-70" : "text-[var(--color-text-main)]"
            )}>
              {task.title}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-[var(--color-text-purple)] hover:text-[var(--color-primary-dark)] transition-colors rounded-full hover:bg-white/50"
            >
              <Save className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-purple)] transition-colors rounded-full hover:bg-white/50"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] transition-colors rounded-full hover:bg-white/50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
