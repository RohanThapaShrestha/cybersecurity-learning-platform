'use client';

import Link from 'next/link';
import { stages } from '@/data/stages';
import { homework } from '@/data/homework';
import { useProgress } from '@/hooks/useProgress';

export default function Dashboard() {
  const { progress, isLoaded, overallProgress, totalLessons, totalHomework } = useProgress();

  const currentStage = stages.find(s => s.id === progress.currentStage) || stages[0];
  const allLessons = stages.flatMap(s => s.lessons);
  const pendingHomework = homework.filter(h => !progress.completedHomework.includes(h.id));
  const recentlyCompleted = allLessons.filter(l => progress.completedLessons.includes(l.id)).slice(-3);

  // Find next recommended lesson
  const nextLesson = allLessons.find(l => !progress.completedLessons.includes(l.id));

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Learning <span className="gradient-text">Dashboard</span></h1>
          <p className="text-text-secondary">Track your progress and continue learning.</p>
        </div>

        {/* Overall Progress */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Overall Progress</h2>
              <p className="text-sm text-text-secondary">
                {isLoaded ? `${progress.completedLessons.length} of ${totalLessons} lessons • ${progress.completedHomework.length} of ${totalHomework} homework tasks` : 'Loading...'}
              </p>
            </div>
            <div className="text-3xl font-black gradient-text">{overallProgress}%</div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }}></div>
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
                    {currentStage.topics.slice(0, 4).map(t => (
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
                  {pendingHomework.slice(0, 5).map(hw => (
                    <Link key={hw.id} href={`/homework/${hw.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-card-hover transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>📝</div>
                        <div>
                          <p className="text-sm font-medium text-text-primary group-hover:text-cyber-green transition-colors">{hw.title}</p>
                          <p className="text-xs text-text-muted">{stages.find(s => s.id === hw.stageId)?.title}</p>
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
            {/* Stats */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Your Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Lessons Completed', value: isLoaded ? progress.completedLessons.length : 0, total: totalLessons, color: '#00ff88' },
                  { label: 'Homework Done', value: isLoaded ? progress.completedHomework.length : 0, total: totalHomework, color: '#00d4ff' },
                  { label: 'Stages Explored', value: isLoaded ? new Set(progress.completedLessons.map(lid => allLessons.find(l => l.id === lid)).filter(Boolean).map(l => stages.find(s => s.lessons.some(sl => sl.id === l!.id))?.number)).size : 0, total: 6, color: '#9d00ff' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">{stat.label}</span>
                      <span className="font-mono font-bold" style={{ color: stat.color }}>{stat.value}/{stat.total}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="h-full rounded" style={{ width: `${(stat.value / stat.total) * 100}%`, background: stat.color, transition: 'width 0.6s ease' }}></div>
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
                  {recentlyCompleted.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyber-green"></div>
                      <span className="text-sm text-text-secondary">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: '/roadmap', label: 'View Roadmap', icon: '🗺️' },
                  { href: '/tools', label: 'Tool Library', icon: '🔧' },
                  { href: '/resources', label: 'Resources', icon: '📚' },
                ].map(link => (
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
