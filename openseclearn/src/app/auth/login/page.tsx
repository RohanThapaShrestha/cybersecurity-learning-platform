'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      login(data.token, data.user);

      const from = searchParams.get('from') || '/dashboard';
      router.push(from);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8">
      {error && (
        <div
          className="mb-5 p-4 rounded-lg text-sm border"
          style={{ background: 'rgba(255, 0, 85, 0.08)', borderColor: 'rgba(255, 0, 85, 0.3)', color: '#ff6b6b' }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
            Email or Username
          </label>
          <input
            id="email"
            type="text"
            autoComplete="username"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg text-sm bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg text-sm bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green transition-colors"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-xs text-cyber-green hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign in →'
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00ff88, transparent)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}
            >
              ◈
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Open</span>
              <span className="text-text-primary">SecLearn</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black mt-6 mb-2">Welcome back</h1>
          <p className="text-text-secondary text-sm">Sign in to continue your learning journey</p>
        </div>

        {/* Wrap the part using useSearchParams in Suspense */}
        <Suspense fallback={<div className="glass-card p-8 text-center text-text-muted text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-cyber-green hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
