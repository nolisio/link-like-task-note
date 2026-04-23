'use client';

import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TaskList({ tasks, onUpdate, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-color-text-muted">
        <div className="w-24 h-24 mb-4 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center shadow-inner">
          <span className="text-4xl">✨</span>
        </div>
        <p className="font-bold text-sm">タスクがありません！</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 sm:pb-8">
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
