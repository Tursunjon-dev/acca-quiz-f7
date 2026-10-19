'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, error, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-[color:rgb(var(--accent))]" />
            <h1 className="text-2xl font-bold">ACCA F7 Quiz</h1>
          </div>

          <h2 className="text-lg font-semibold text-center mb-6">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input w-full"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={6}
                className="input w-full"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-[color:rgb(var(--accent))] font-medium hover:underline"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-4">
          ACCA F7 Financial Reporting Study Platform
        </p>
      </div>
    </div>
  );
}
