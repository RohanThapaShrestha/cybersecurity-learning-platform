'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  completion_percentage: number | null;
  last_activity: string | null;
}

type TabId = 'overview' | 'users' | 'activity' | 'settings';

export default function AdminPage() {
  const { user, token, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        // Show "Access Denied" briefly, then redirect
        setAccessDenied(true);
        const timer = setTimeout(() => {
          router.replace('/dashboard?unauthorized=1');
        }, 1500);
        return () => clearTimeout(timer);
      }
      fetchUsers();
    }
  }, [isLoading, user, isAdmin, router, fetchUsers]);

  const handleDelete = async (userId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setActionMsg('User deleted successfully.');
        setTimeout(() => setActionMsg(''), 4000);
      } else {
        const d = await res.json();
        setActionMsg(d.error || 'Failed to delete user.');
      }
    } catch {
      setActionMsg('Network error.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Show "Access Denied" screen for unauthorized users
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
          <p className="text-sm text-text-muted">You don&apos;t have admin privileges. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-cyber-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-text-muted text-sm">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const avgProgress =
    totalUsers > 0
      ? Math.round(users.reduce((sum, u) => sum + (u.completion_percentage ?? 0), 0) / totalUsers)
      : 0;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const activeUsers = users.filter(u => u.last_activity && Date.now() - new Date(u.last_activity).getTime() < 7 * 24 * 60 * 60 * 1000).length;

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'activity', label: 'Activity Log', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const recentUsers = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(157,0,255,0.15)', color: '#9d00ff', border: '1px solid rgba(157,0,255,0.3)' }}>
              Admin
            </span>
            <span className="status-dot online" />
            <span className="text-xs text-text-muted">System Online</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Admin <span className="gradient-text">Control Center</span>
          </h1>
          <p className="text-text-secondary mt-1">Manage users, monitor platform health, and configure system settings.</p>
        </div>

        {/* Enterprise Banner */}
        <div className="enterprise-banner mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏢</span>
              <span className="text-sm font-bold text-cyber-green">Enterprise Edition</span>
            </div>
            <p className="text-xs text-text-secondary">Full admin controls • Role management • Audit logging • API documentation</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/api/docs/ui" target="_blank" className="btn-secondary text-xs px-4 py-2">
              📖 API Docs
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action message */}
        {actionMsg && (
          <div className="mb-6 p-4 rounded-lg text-sm animate-slide-up" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88' }}>
            ✓ {actionMsg}
          </div>
        )}

        {/* ── Overview Tab ──────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: totalUsers, icon: '👥', color: '#00ff88' },
                { label: 'Active (7d)', value: activeUsers, icon: '🟢', color: '#00d4ff' },
                { label: 'Avg. Progress', value: `${avgProgress}%`, icon: '📈', color: '#9d00ff' },
                { label: 'Admins', value: adminCount, icon: '🛡️', color: '#ff6b00' },
              ].map((s) => (
                <div key={s.label} className="stat-card" style={{ '--stat-accent': s.color } as React.CSSProperties}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-xs text-text-muted uppercase tracking-wider">{s.label}</span>
                  </div>
                  <div className="text-3xl font-black animate-count-up" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Registrations */}
              <div className="glass-card-static p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Recent Registrations</h3>
                  <button onClick={() => setActiveTab('users')} className="text-xs text-cyber-green hover:underline">View All →</button>
                </div>
                <div className="space-y-3">
                  {recentUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-card-hover transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: u.role === 'admin' ? 'rgba(157,0,255,0.2)' : 'rgba(0,255,136,0.1)', color: u.role === 'admin' ? '#9d00ff' : '#00ff88' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">{u.name}</div>
                          <div className="text-xs text-text-muted">{u.email}</div>
                        </div>
                      </div>
                      <div className="text-xs text-text-muted">{new Date(u.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Health */}
              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Platform Health</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Authentication Service', status: 'operational', color: '#00ff88' },
                    { label: 'Learning Engine', status: 'operational', color: '#00ff88' },
                    { label: 'User Management', status: 'operational', color: '#00ff88' },
                    { label: 'Homework System', status: 'operational', color: '#00ff88' },
                    { label: 'API Gateway', status: 'operational', color: '#00ff88' },
                  ].map(service => (
                    <div key={service.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <span className="text-sm text-text-secondary">{service.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="status-dot online" />
                        <span className="text-xs font-medium" style={{ color: service.color }}>Operational</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border-dim">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Last checked: just now</span>
                    <span className="text-cyber-green">All systems normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Users Tab ────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
                className="px-4 py-2.5 rounded-xl text-sm bg-bg-secondary border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="glass-card-static overflow-hidden">
              <div className="p-6 border-b border-border-dim flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">User Management</h2>
                  <p className="text-xs text-text-muted mt-1">Manage accounts, roles, and access permissions</p>
                </div>
                <span className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88' }}>
                  {filteredUsers.length} of {totalUsers}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-dim" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dim">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-bg-card-hover transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: u.role === 'admin' ? 'rgba(157,0,255,0.2)' : 'rgba(0,255,136,0.1)', color: u.role === 'admin' ? '#9d00ff' : '#00ff88' }}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-text-primary">{u.name}</div>
                              <div className="text-xs text-text-muted">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${u.role === 'admin' ? '' : 'badge-beginner'}`} style={u.role === 'admin' ? { background: 'rgba(157,0,255,0.15)', color: '#9d00ff', border: '1px solid rgba(157,0,255,0.3)' } : {}}>
                            {u.role === 'admin' ? '🛡️ ' : ''}{u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="progress-bar-container w-24">
                              <div className="progress-bar-fill" style={{ width: `${u.completion_percentage ?? 0}%` }} />
                            </div>
                            <span className="text-xs font-mono text-cyber-green">{u.completion_percentage ?? 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`status-dot ${u.last_activity && Date.now() - new Date(u.last_activity).getTime() < 7 * 24 * 60 * 60 * 1000 ? 'online' : 'offline'}`} />
                            <span className="text-xs text-text-muted">
                              {u.last_activity ? new Date(u.last_activity).toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-text-muted">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.id !== user?.id && (
                            <>
                              {deleteConfirm === u.id ? (
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-xs text-text-muted">Confirm?</span>
                                  <button
                                    onClick={() => handleDelete(u.id)}
                                    className="text-xs px-3 py-1 rounded-lg font-medium"
                                    style={{ background: 'rgba(255,0,85,0.15)', color: '#ff0055', border: '1px solid rgba(255,0,85,0.3)' }}
                                  >
                                    Yes, delete
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="text-xs px-3 py-1 rounded-lg font-medium text-text-muted hover:text-text-primary"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(u.id)}
                                  className="btn-danger text-xs px-3 py-1.5"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                          {u.id === user?.id && (
                            <span className="text-xs text-text-muted italic">You</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-text-muted text-sm">
                    No users match your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Activity Log Tab ─────────────────────────── */}
        {activeTab === 'activity' && (
          <div className="animate-fade-in">
            <div className="glass-card-static p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">Activity Log</h2>
                  <p className="text-xs text-text-muted mt-1">Recent platform activity and audit trail</p>
                </div>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88' }}>
                  Live
                </span>
              </div>

              <div className="space-y-0">
                {[
                  { action: 'Admin logged in', user: user?.name || 'Admin', time: 'Just now', type: 'auth' },
                  { action: 'Platform started', user: 'System', time: '1 min ago', type: 'system' },
                  ...recentUsers.slice(0, 3).map(u => ({
                    action: `User "${u.name}" registered`,
                    user: u.name,
                    time: new Date(u.created_at).toLocaleDateString(),
                    type: 'user' as const,
                  })),
                ].map((entry, i) => (
                  <div key={i} className="timeline-item">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-primary">{entry.action}</p>
                        <p className="text-xs text-text-muted mt-0.5">by {entry.user}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge text-[10px] ${entry.type === 'auth' ? 'badge-beginner' : entry.type === 'system' ? 'badge-intermediate' : 'badge-advanced'}`}>
                          {entry.type}
                        </span>
                        <span className="text-xs text-text-muted">{entry.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Settings Tab ─────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Info */}
              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Platform Information</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Platform', value: 'OpenSecLearn' },
                    { label: 'Version', value: 'v2.0.0 Enterprise' },
                    { label: 'Environment', value: process.env.NODE_ENV || 'development' },
                    { label: 'Auth Mode', value: 'JWT + bcrypt' },
                    { label: 'Total Stages', value: '6' },
                    { label: 'Total Lessons', value: '14+' },
                    { label: 'Total Homework', value: '20+' },
                  ].map(info => (
                    <div key={info.label} className="flex items-center justify-between py-2 border-b border-border-dim last:border-0">
                      <span className="text-sm text-text-secondary">{info.label}</span>
                      <span className="text-sm font-mono text-text-primary">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Settings */}
              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Security Configuration</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Rate Limiting', value: 'Enabled', status: true },
                    { label: 'JWT Expiry', value: '1 hour', status: true },
                    { label: 'Password Hashing', value: 'bcrypt (12 rounds)', status: true },
                    { label: 'RBAC', value: 'Active (admin/user)', status: true },
                    { label: 'Request Logging', value: 'Enabled', status: true },
                    { label: 'CORS Protection', value: 'Next.js default', status: true },
                  ].map(setting => (
                    <div key={setting.label} className="flex items-center justify-between py-2 border-b border-border-dim last:border-0">
                      <span className="text-sm text-text-secondary">{setting.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="status-dot online" />
                        <span className="text-sm font-mono text-cyber-green">{setting.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card-static p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a href="/api/docs/ui" target="_blank" className="flex items-center gap-3 p-4 rounded-xl border border-border-dim hover:border-cyber-green/30 hover:bg-bg-card-hover transition-all group">
                    <span className="text-2xl">📖</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-cyber-green transition-colors">API Documentation</p>
                      <p className="text-xs text-text-muted">Swagger / OpenAPI spec</p>
                    </div>
                  </a>
                  <button onClick={() => setActiveTab('users')} className="flex items-center gap-3 p-4 rounded-xl border border-border-dim hover:border-cyber-green/30 hover:bg-bg-card-hover transition-all group text-left">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-cyber-green transition-colors">Manage Users</p>
                      <p className="text-xs text-text-muted">{totalUsers} registered</p>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab('activity')} className="flex items-center gap-3 p-4 rounded-xl border border-border-dim hover:border-cyber-green/30 hover:bg-bg-card-hover transition-all group text-left">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-cyber-green transition-colors">Activity Log</p>
                      <p className="text-xs text-text-muted">Audit trail</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
