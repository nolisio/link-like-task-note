'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { Task, Priority, FilterType } from '../../types';
import Header from '../../components/Header';
import TaskInput from '../../components/TaskInput';
import FilterBar from '../../components/FilterBar';
import TaskList from '../../components/TaskList';
import BottomNav from '../../components/BottomNav';

export default function TasksPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setInitialLoad(false);
      }
    };
    fetchTasks();
  }, [token]);

  const handleAddTask = async (title: string, priority: Priority) => {
    const newTask = await api.createTask(title, priority);
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    const updatedTask = await api.updateTask(id, updates);
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
  };

  const handleDeleteTask = async (id: number) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    for (const task of completedTasks) {
      await api.deleteTask(task.id);
    }
    setTasks(prev => prev.filter(t => !t.completed));
  };

  if (isLoading || (token && initialLoad)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--color-primary-dark)] text-xl font-bold animate-pulse tracking-widest flex items-center gap-2">
          <span>✨</span> LINK TASK <span>✨</span>
        </div>
      </div>
    );
  }

  if (!token) return null;

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const hasCompleted = tasks.some(t => t.completed);

  return (
    <div className="min-h-screen flex flex-col pb-20 sm:pb-0">
      <Header tasks={tasks} />
      
      <main className="flex-1 w-full max-w-[420px] sm:max-w-2xl mx-auto overflow-hidden flex flex-col">
        <div className="sticky top-[148px] z-40 bg-transparent pt-4 pb-2">
          <TaskInput onAdd={handleAddTask} />
        </div>
        
        <FilterBar 
          filter={filter} 
          setFilter={setFilter} 
          onClearCompleted={handleClearCompleted}
          hasCompleted={hasCompleted}
        />
        
        <div className="flex-1 overflow-y-auto px-4 mt-2 sm:mt-4">
          <TaskList 
            tasks={filteredTasks} 
            onUpdate={handleUpdateTask} 
            onDelete={handleDeleteTask} 
          />
        </div>
      </main>

      <BottomNav filter={filter} setFilter={setFilter} />
    </div>
  );
}
