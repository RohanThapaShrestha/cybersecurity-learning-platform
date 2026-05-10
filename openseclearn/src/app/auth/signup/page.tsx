'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        setError(data.error || 'Signup failed');
        return;
      }

      login(data.token, data.user);
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const field = (name: string, label: string, type: string, placeholder: string, autoComplete: string) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <input
        id={name}
        type={type}
        autoComplete={autoComplete}
        required
        value={formData[name as keyof typeof formData]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg text-sm bg-bg-secondary border text-text-primary focus:outline-none focus:border-cyber-green transition-colors ${fieldErrors[name] ? 'border-red-500' : 'border-border-dim'}`}
        placeholder={placeholder}
      />
      {fieldErrors[name] && (
        <p className="text-xs text-red-400 mt-1">{fieldErrors[name][0]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00d4ff, transparent)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}>
              ◈
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Open</span>
              <span className="text-text-primary">SecLearn</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black mt-6 mb-2">Create your account</h1>
          <p className="text-text-secondary text-sm">Start your cybersecurity journey today — free</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {error && (
            <div className="mb-5 p-4 rounded-lg text-sm border" style={{ background: 'rgba(255, 0, 85, 0.08)', borderColor: 'rgba(255, 0, 85, 0.3)', color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {field('name', 'Full name', 'text', 'Your name', 'name')}
            {field('email', 'Email address', 'email', 'you@example.com', 'email')}
            {field('password', 'Password', 'password', 'Min. 8 characters', 'new-password')}
            {field('confirmPassword', 'Confirm password', 'password', 'Repeat your password', 'new-password')}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account →'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-cyber-green hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
