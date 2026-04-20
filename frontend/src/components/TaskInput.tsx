'use client';

import React, { useState } from 'react';
import { Priority } from '../types';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAdd: (title: string, priority: Priority) => Promise<void>;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      await onAdd(title, priority);
      setTitle('');
      setPriority('MEDIUM');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 flex items-center gap-2 max-w-2xl mx-auto w-full">
      <div className="flex-1 glass-card rounded-[20px] p-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[var(--color-primary-light)] transition-shadow bg-white/70">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="appearance-none bg-transparent border-none text-[var(--color-text-purple)] font-black text-sm pl-4 pr-2 outline-none cursor-pointer"
        >
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
        </select>
        
        <div className="w-px h-6 bg-[var(--color-text-muted)] opacity-30" />
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 bg-transparent border-none text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] font-bold text-sm px-2 py-2 outline-none"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-[52px] h-[52px] shrink-0 rounded-[20px] bg-button-gradient shadow-[0_4px_12px_rgba(176,140,255,0.4)] flex items-center justify-center text-white hover-lift active-scale disabled:opacity-50 disabled:grayscale transition-all"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>
    </form>
  );
}
