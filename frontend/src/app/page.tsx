'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) router.replace('/tasks');
      else router.replace('/login');
    }
  }, [token, isLoading, router]);

  return <div className="min-h-screen flex items-center justify-center text-color-text-main dark:text-white">読み込み中...</div>;
}
