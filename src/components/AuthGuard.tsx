'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin text-[color:rgb(var(--accent))]" />
          <p className="text-muted">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
