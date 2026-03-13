'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/homework', label: 'Homework' },
    { href: '/tools', label: 'Tools' },
    { href: '/resources', label: 'Resources' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-dim" style={{ background: 'rgba(10, 14, 23, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}>
              ◈
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Open</span>
              <span className="text-text-primary">SecLearn</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary transition-all duration-200 hover:text-cyber-green hover:bg-cyber-green/5"
              >
                {link.label}
              </Link>
            ))}
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
        <div className="md:hidden border-t border-border-dim" style={{ background: 'rgba(10, 14, 23, 0.95)' }}>
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-cyber-green hover:bg-cyber-green/5 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
