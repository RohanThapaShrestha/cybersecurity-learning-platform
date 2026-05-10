'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Refs for OTP auto-focus
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP input when step changes to 'otp'
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // ── Step 1: Submit email ──────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSuccessMsg(data.message);
      setStep('otp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handling ────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste — spread digits across inputs
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Step 2: Verify OTP ────────────────────
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        return;
      }

      setResetToken(data.resetToken);
      setStep('password');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset password ────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setStep('success');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────
  const handleResendOtp = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP');
        return;
      }

      setSuccessMsg('A new verification code has been sent.');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step indicator
  const steps = [
    { id: 'email', label: 'Email', num: 1 },
    { id: 'otp', label: 'Verify', num: 2 },
    { id: 'password', label: 'Reset', num: 3 },
  ];

  const currentStepNum = step === 'email' ? 1 : step === 'otp' ? 2 : step === 'password' ? 3 : 4;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #9d00ff, transparent)', filter: 'blur(80px)' }}
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
          <h1 className="text-2xl font-black mt-6 mb-2">
            {step === 'success' ? 'Password Reset' : 'Forgot Password'}
          </h1>
          <p className="text-text-secondary text-sm">
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'otp' && 'Enter the 6-digit code sent to your email'}
            {step === 'password' && 'Set your new password'}
            {step === 'success' && 'Your password has been updated'}
          </p>
        </div>

        {/* Progress Steps (hidden on success) */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    background: currentStepNum >= s.num
                      ? 'linear-gradient(135deg, #00ff88, #00cc6a)'
                      : 'rgba(255,255,255,0.06)',
                    color: currentStepNum >= s.num ? '#0a0e17' : '#666',
                    boxShadow: currentStepNum === s.num ? '0 0 15px rgba(0,255,136,0.3)' : 'none',
                  }}
                >
                  {currentStepNum > s.num ? '✓' : s.num}
                </div>
                <span
                  className="text-xs font-medium hidden sm:inline"
                  style={{ color: currentStepNum >= s.num ? '#00ff88' : '#666' }}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className="w-12 h-0.5 rounded-full"
                    style={{ background: currentStepNum > s.num ? '#00ff88' : 'rgba(255,255,255,0.1)' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="glass-card p-8">
          {/* Error */}
          {error && (
            <div
              className="mb-5 p-4 rounded-lg text-sm border animate-slide-up"
              style={{ background: 'rgba(255, 0, 85, 0.08)', borderColor: 'rgba(255, 0, 85, 0.3)', color: '#ff6b6b' }}
            >
              {error}
            </div>
          )}

          {/* Success message */}
          {successMsg && !error && (
            <div
              className="mb-5 p-4 rounded-lg text-sm border animate-slide-up"
              style={{ background: 'rgba(0, 255, 136, 0.08)', borderColor: 'rgba(0, 255, 136, 0.2)', color: '#00ff88' }}
            >
              ✓ {successMsg}
            </div>
          )}

          {/* ── Step 1: Email ──────────────────── */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : (
                  'Send verification code →'
                )}
              </button>
            </form>
          )}

          {/* ── Step 2: OTP ────────────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-4 text-center">
                  Verification code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-14 sm:w-12 sm:h-16 rounded-xl text-center text-xl font-bold bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green transition-all"
                      style={{
                        boxShadow: digit ? '0 0 10px rgba(0,255,136,0.15)' : 'none',
                        borderColor: digit ? 'rgba(0,255,136,0.4)' : undefined,
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted text-center mt-3">
                  Sent to <span className="text-text-secondary">{email}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="btn-primary w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify code →'
                )}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); setSuccessMsg(''); }}
                  className="text-text-muted hover:text-text-secondary transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-cyber-green hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: New Password ───────────── */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-2">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="Min. 6 characters"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-text-secondary mb-2">
                  Confirm new password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="Repeat your new password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  'Reset password →'
                )}
              </button>
            </form>
          )}

          {/* ── Step 4: Success ────────────────── */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-lg font-bold text-text-primary mb-2">Password Updated!</h2>
              <p className="text-sm text-text-secondary mb-6">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <Link href="/auth/login" className="btn-primary text-sm px-8 py-3 inline-block">
                Sign in →
              </Link>
            </div>
          )}
        </div>

        {/* Back to login */}
        {step !== 'success' && (
          <p className="text-center text-sm text-text-muted mt-6">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-cyber-green hover:underline font-medium">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
