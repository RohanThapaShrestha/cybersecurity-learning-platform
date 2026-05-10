'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/roadmap', label: 'Roadmap', icon: '🗺️' },
    { href: '/homework', label: 'Homework', icon: '📝' },
    { href: '/tools', label: 'Tools', icon: '🔧' },
    { href: '/resources', label: 'Resources', icon: '📚' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border-dim"
      style={{ background: 'rgba(10, 14, 23, 0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}
            >
              ◈
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Open</span>
              <span className="text-text-primary">SecLearn</span>
            </span>
            <span className="hidden lg:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(157,0,255,0.15)', color: '#9d00ff', border: '1px solid rgba(157,0,255,0.3)' }}>
              Enterprise
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary transition-all duration-200 hover:text-cyber-green hover:bg-cyber-green/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth section – desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-8 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            ) : user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:shadow-[0_0_12px_rgba(157,0,255,0.3)]"
                    style={{ background: 'rgba(157, 0, 255, 0.15)', color: '#9d00ff', border: '1px solid rgba(157, 0, 255, 0.3)' }}
                  >
                    🛡️ Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-cyber-green">{user.name}</span>
                  {user.role === 'admin' && <span className="status-dot online" />}
                </div>
                <button
                  onClick={logout}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-cyber-green transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-cyber-green transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden border-t border-border-dim animate-slide-up"
          style={{ background: 'rgba(10, 14, 23, 0.95)' }}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-cyber-green hover:bg-cyber-green/5 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border-dim mt-2">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-cyber-purple hover:bg-cyber-purple/5 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      🛡️ Admin Panel
                    </Link>
                  )}
                  <div className="px-4 py-2 text-sm text-text-muted flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    Signed in as <span className="text-cyber-green">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-cyber-red hover:bg-red-500/5 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-cyber-green hover:bg-cyber-green/5 transition-all" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth/signup" className="block px-4 py-3 rounded-lg text-sm font-medium text-cyber-green hover:bg-cyber-green/5 transition-all" onClick={() => setIsOpen(false)}>
                    Sign Up →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
