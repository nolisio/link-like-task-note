'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      router.push('/tasks');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-[24px] flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient inline-block tracking-widest mb-2">
          LINK TASK
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm font-medium">
          {isLogin ? 'おかえりなさい！' : 'はじめまして！'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--color-text-purple)] text-sm font-bold pl-2">
              ユーザー名
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-white/80 rounded-[20px] px-5 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:bg-white transition-colors"
              placeholder="ユーザー名を入力"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--color-text-purple)] text-sm font-bold pl-2">
            メールアドレス
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-white/80 rounded-[20px] px-5 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:bg-white transition-colors"
            placeholder="メールアドレスを入力"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--color-text-purple)] text-sm font-bold pl-2">
            パスワード
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-white/80 rounded-[20px] px-5 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:bg-white transition-colors"
            placeholder="パスワードを入力"
          />
        </div>

        {error && (
          <div className="text-[var(--color-accent-coral)] text-sm font-bold text-center bg-[var(--color-accent-coral)]/10 py-2 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-button-gradient text-white font-bold rounded-[20px] py-4 shadow-[0_4px_12px_rgba(244,144,180,0.3)] hover-lift active-scale flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : isLogin ? 'ログイン' : '登録する'}
        </button>
      </form>

      <div className="text-center mt-2">
        <button
          onClick={() => router.push(isLogin ? '/register' : '/login')}
          className="text-[var(--color-primary-dark)] text-sm font-bold hover:text-[var(--color-accent-pink)] transition-colors"
        >
          {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
        </button>
      </div>
    </div>
  );
}
