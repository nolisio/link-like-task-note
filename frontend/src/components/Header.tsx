'use client';

import React, { useEffect, useState } from 'react';
import { User, Task } from '../types';
import { useAuth } from '../lib/auth';
import { Sparkles, Trophy, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  tasks: Task[];
}

export default function Header({ tasks }: HeaderProps) {
  const { user, logout } = useAuth();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <header className="sticky top-0 z-50 glass-header flex flex-col pt-safe">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-rank-gradient text-white px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1 border border-white/50 dark:border-white/20">
            <Trophy className="w-3 h-3" />
            Rank 1
          </div>
          <div className="text-color-text-purple font-bold text-sm tracking-wide">
            {time}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-color-text-muted font-bold leading-none">ユーザー</span>
            <span className="text-color-text-main font-black text-sm">{user?.username || 'ゲスト'}</span>
          </div>
          <ThemeToggle />
          <button 
            onClick={logout}
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-white/10 border border-white/50 dark:border-white/20 shadow-sm flex items-center justify-center text-color-text-muted hover:text-color-accent-coral dark:hover:text-color-accent-pink active-scale hover-lift"
          >
            <LogOut className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      <div className="bg-titlebar-gradient py-2.5 px-4 shadow-[0_2px_10px_rgba(232,144,184,0.3)] dark:shadow-[0_2px_10px_rgba(90,74,127,0.4)] border-y border-white/40 dark:border-white/20 flex items-center justify-center gap-2">
        <Sparkles className="text-white w-4 h-4 opacity-80" />
        <h1 className="text-white font-black tracking-widest text-lg drop-shadow-sm">LINK TASK</h1>
        <Sparkles className="text-white w-4 h-4 opacity-80" />
      </div>

      <div className="flex gap-4 px-4 py-3 bg-white/30 dark:bg-black/20">
        <div className="flex-1 bg-white/70 dark:bg-color-surface backdrop-blur-md rounded-2xl py-2 px-4 shadow-sm border border-white/60 dark:border-white/10 flex flex-col items-center">
          <span className="text-[10px] text-color-text-muted font-black">進行中</span>
          <span className="text-xl font-black text-color-text-purple dark:text-color-primary-light leading-tight">{activeCount}</span>
        </div>
        <div className="flex-1 bg-white/70 dark:bg-color-surface backdrop-blur-md rounded-2xl py-2 px-4 shadow-sm border border-white/60 dark:border-white/10 flex flex-col items-center">
          <span className="text-[10px] text-color-text-muted font-black">完了</span>
          <span className="text-xl font-black text-color-accent-pink dark:text-color-accent-rose leading-tight">{completedCount}</span>
        </div>
      </div>
    </header>
  );
}
