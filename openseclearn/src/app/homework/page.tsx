'use client';

import Link from 'next/link';
import { useState } from 'react';
import { homework } from '@/data/homework';
import { stages } from '@/data/stages';
import { useProgress } from '@/hooks/useProgress';

export default function HomeworkHub() {
  const [filter, setFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const { progress } = useProgress();

  const filtered = homework.filter(hw => {
    if (filter !== 'all' && hw.stageId !== filter) return false;
    if (difficultyFilter !== 'all' && hw.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Homework <span className="gradient-text">Hub</span></h1>
          <p className="text-text-secondary">Practice what you&apos;ve learned with hands-on tasks. Each homework includes hints and detailed solutions.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm bg-bg-card border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green"
          >
            <option value="all">All Stages</option>
            {stages.map(s => <option key={s.id} value={s.id}>Stage {s.number}: {s.title}</option>)}
          </select>

          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm bg-bg-card border border-border-dim text-text-primary focus:outline-none focus:border-cyber-green"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="ml-auto text-sm text-text-muted self-center">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Homework List */}
        <div className="space-y-4">
          {filtered.map(hw => {
            const isCompleted = progress.completedHomework.includes(hw.id);
            const stage = stages.find(s => s.id === hw.stageId);
            return (
              <Link key={hw.id} href={`/homework/${hw.id}`} className="glass-card p-5 flex items-start gap-4 group block">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{
                  background: isCompleted ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : 'rgba(255,255,255,0.05)',
                  color: isCompleted ? '#0a0e17' : '#94a3b8',
                }}>
                  {isCompleted ? '✓' : '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-text-primary group-hover:text-cyber-green transition-colors">{hw.title}</h3>
                    <span className={`badge badge-${hw.difficulty}`}>{hw.difficulty}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{hw.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    {stage && <span style={{ color: stage.color }}>Stage {stage.number}</span>}
                    <span>{hw.hints.length} hints</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-cyber-green opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">Open →</span>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <p className="text-lg mb-2">No homework found</p>
            <p className="text-sm">Try changing your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
