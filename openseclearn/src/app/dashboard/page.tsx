'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { stages } from '@/data/stages';
import { homework } from '@/data/homework';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/context/AuthContext';

interface DbProgress {
  completed_lessons: string[];
  completed_homework: string[];
  current_stage: string;
  completion_percentage: number;
  last_activity: string | null;
}

const TOTAL_LESSONS = 14;
const TOTAL_HOMEWORK = 20;

/** Inner component that uses useSearchParams (requires Suspense boundary) */
function DashboardContent() {
  const { progress: localProgress, isLoaded, overallProgress: localOverallProgress, totalLessons, totalHomework } = useProgress();
  const { user, token, isAdmin } = useAuth();
  const searchParams = useSearchParams();

  const [dbProgress, setDbProgress] = useState<DbProgress | null>(null);
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  // Show "Access Denied" flash if redirected from an admin page
  useEffect(() => {
    if (searchParams.get('unauthorized') === '1') {
      setShowUnauthorized(true);
      // Clean the URL
      window.history.replaceState({}, '', '/dashboard');
      const timer = setTimeout(() => setShowUnauthorized(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Fetch DB progress when authenticated
  useEffect(() => {
    if (!token) return;
    fetch('/api/progress/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.progress) setDbProgress(d.progress);
      })
      .catch(() => {});
  }, [token]);

  // Resolve which progress source to use
  const completedLessons: string[] = dbProgress ? dbProgress.completed_lessons : (isLoaded ? localProgress.completedLessons : []);
  const completedHomework: string[] = dbProgress ? dbProgress.completed_homework : (isLoaded ? localProgress.completedHomework : []);
  const currentStageId = dbProgress ? dbProgress.current_stage : localProgress.currentStage;
  const overallProgress = dbProgress ? Math.round(dbProgress.completion_percentage) : localOverallProgress;

  const currentStage = stages.find((s) => s.id === currentStageId) || stages[0];
  const allLessons = stages.flatMap((s) => s.lessons);
  const pendingHomework = homework.filter((h) => !completedHomework.includes(h.id));
  const recentlyCompleted = allLessons.filter((l) => completedLessons.includes(l.id)).slice(-3);
  const nextLesson = allLessons.find((l) => !completedLessons.includes(l.id));

  // Compute performance stats
  const totalCompleted = completedLessons.length + completedHomework.length;
  const totalItems = TOTAL_LESSONS + TOTAL_HOMEWORK;
  const stagesExplored = new Set(
    completedLessons
      .map((lid) => allLessons.find((l) => l.id === lid))
      .filter(Boolean)
      .map((l) => stages.find((s) => s.lessons.some((sl) => sl.id === l!.id))?.number)
  ).size;

  // Build activity history from completed items
  const activityHistory: { type: 'lesson' | 'homework'; title: string; icon: string }[] = [
    ...completedLessons.map((lid) => {
      const lesson = allLessons.find((l) => l.id === lid);
      return { type: 'lesson' as const, title: lesson?.title || lid, icon: '📖' };
    }),
    ...completedHomework.map((hid) => {
      const hw = homework.find((h) => h.id === hid);
      return { type: 'homework' as const, title: hw?.title || hid, icon: '📝' };
    }),
  ].reverse().slice(0, 8);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unauthorized access flash */}
        {showUnauthorized && (
          <div
            className="mb-6 p-4 rounded-lg text-sm animate-slide-up flex items-center gap-3"
            style={{ background: 'rgba(255,0,85,0.08)', border: '1px solid rgba(255,0,85,0.3)', color: '#ff6b6b' }}
          >
            <span className="text-lg">🚫</span>
            <div>
              <span className="font-semibold">Access Denied</span> — You don&apos;t have permission to access that page.
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            {user ? `Welcome back, ` : ''}
            {user ? <span className="gradient-text">{user.name}</span> : ''}
            {!user && <>Learning <span className="gradient-text">Dashboard</span></>}
          </h1>
          <p className="text-text-secondary">Track your progress and continue learning.</p>
        </div>

        {/* Overall Progress */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Overall Progress</h2>
              <p className="text-sm text-text-secondary">
                {isLoaded || dbProgress
                  ? `${completedLessons.length} of ${totalLessons} lessons • ${completedHomework.length} of ${totalHomework} homework tasks`
                  : 'Loading...'}
              </p>
            </div>
            <div className="text-3xl font-black gradient-text">{overallProgress}%</div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Stage */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Current Stage</h3>
              <Link href={`/stages/${currentStage.id}`} className="flex items-start gap-4 group">
                <div className="text-4xl">{currentStage.icon}</div>
                <div>
                  <div className="text-xs font-mono text-text-muted mb-1">STAGE {currentStage.number}</div>
                  <h4 className="text-lg font-bold text-text-primary group-hover:text-cyber-green transition-colors">{currentStage.title}</h4>
                  <p className="text-sm text-text-secondary mt-1">{currentStage.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentStage.topics.slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-xs text-text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>

            {/* Next Recommended Lesson */}
            {nextLesson && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Recommended Next</h3>
                <Link href={`/lessons/${nextLesson.id}`} className="flex items-center justify-between group">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary group-hover:text-cyber-green transition-colors">{nextLesson.title}</h4>
                    <p className="text-sm text-text-secondary mt-1">{nextLesson.description}</p>
                    <span className="inline-block mt-2 text-xs font-mono text-text-muted">⏱ {nextLesson.duration}</span>
                  </div>
                  <span className="btn-primary text-sm px-4 py-2 whitespace-nowrap ml-4">Start →</span>
                </Link>
              </div>
            )}

            {/* Activity History */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Activity History</h3>
              {activityHistory.length === 0 ? (
                <p className="text-sm text-text-secondary">No activity yet. Start a lesson to see your history!</p>
              ) : (
                <div className="space-y-0">
                  {activityHistory.map((item, i) => (
                    <div key={i} className="timeline-item">
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <div>
                          <p className="text-sm text-text-primary">{item.title}</p>
                          <p className="text-xs text-text-muted capitalize">{item.type} completed</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Homework */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Pending Homework</h3>
                <Link href="/homework" className="text-xs text-cyber-green hover:underline">View All →</Link>
              </div>
              {pendingHomework.length === 0 ? (
                <p className="text-sm text-text-secondary">All homework completed! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {pendingHomework.slice(0, 5).map((hw) => (
                    <Link key={hw.id} href={`/homework/${hw.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-card-hover transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>📝</div>
                        <div>
                          <p className="text-sm font-medium text-text-primary group-hover:text-cyber-green transition-colors">{hw.title}</p>
                          <p className="text-xs text-text-muted">{stages.find((s) => s.id === hw.stageId)?.title}</p>
                        </div>
                      </div>
                      <span className={`badge badge-${hw.difficulty}`}>{hw.difficulty}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Performance Stats</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
                  <div className="text-2xl font-black text-cyber-green">{totalCompleted}</div>
                  <div className="text-xs text-text-muted mt-1">Items Done</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <div className="text-2xl font-black" style={{ color: '#00d4ff' }}>{totalItems - totalCompleted}</div>
                  <div className="text-xs text-text-muted mt-1">Remaining</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(157,0,255,0.06)', border: '1px solid rgba(157,0,255,0.15)' }}>
                  <div className="text-2xl font-black" style={{ color: '#9d00ff' }}>{stagesExplored}/6</div>
                  <div className="text-xs text-text-muted mt-1">Stages</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.15)' }}>
                  <div className="text-2xl font-black" style={{ color: '#ff6b00' }}>{overallProgress}%</div>
                  <div className="text-xs text-text-muted mt-1">Complete</div>
                </div>
              </div>
            </div>

            {/* Your Stats (progress bars) */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Your Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Lessons Completed', value: completedLessons.length, total: TOTAL_LESSONS, color: '#00ff88' },
                  { label: 'Homework Done', value: completedHomework.length, total: TOTAL_HOMEWORK, color: '#00d4ff' },
                  { label: 'Stages Explored', value: stagesExplored, total: 6, color: '#9d00ff' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">{stat.label}</span>
                      <span className="font-mono font-bold" style={{ color: stat.color }}>{stat.value}/{stat.total}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="h-full rounded" style={{ width: `${(stat.value / stat.total) * 100}%`, background: stat.color, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Completed */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Recently Completed</h3>
              {recentlyCompleted.length === 0 ? (
                <p className="text-sm text-text-secondary">No lessons completed yet. Start learning!</p>
              ) : (
                <div className="space-y-3">
                  {recentlyCompleted.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyber-green" />
                      <span className="text-sm text-text-secondary">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links — role-scoped */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: '/roadmap', label: 'View Roadmap', icon: '🗺️', adminOnly: false },
                  { href: '/tools', label: 'Tool Library', icon: '🔧', adminOnly: false },
                  { href: '/resources', label: 'Resources', icon: '📚', adminOnly: false },
                  // Admin-only links
                  { href: '/admin', label: 'Admin Panel', icon: '🛡️', adminOnly: true },
                  { href: '/api/docs/ui', label: 'API Docs', icon: '📖', adminOnly: true },
                ]
                  .filter((link) => !link.adminOnly || isAdmin)
                  .map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-card-hover transition-colors group">
                      <span>{link.icon}</span>
                      <span className="text-sm text-text-secondary group-hover:text-cyber-green transition-colors">{link.label}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-cyber-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-text-muted text-sm">Loading dashboard...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
