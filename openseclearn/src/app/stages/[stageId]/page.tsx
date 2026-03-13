'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { stages } from '@/data/stages';
import { homework } from '@/data/homework';
import { useProgress } from '@/hooks/useProgress';

export default function StagePage() {
  const params = useParams();
  const stageId = params.stageId as string;
  const stage = stages.find(s => s.id === stageId);
  const { progress, isLoaded } = useProgress();

  if (!stage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Stage Not Found</h1>
          <Link href="/roadmap" className="text-cyber-green hover:underline">← Back to Roadmap</Link>
        </div>
      </div>
    );
  }

  const completedCount = stage.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
  const stageHomework = homework.filter(h => h.stageId === stageId);
  const completedHW = stageHomework.filter(h => progress.completedHomework.includes(h.id)).length;

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/roadmap" className="hover:text-cyber-green transition-colors">Roadmap</Link>
          <span>/</span>
          <span className="text-text-primary">{stage.title}</span>
        </div>

        {/* Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-start gap-5">
            <div className="text-5xl">{stage.icon}</div>
            <div className="flex-1">
              <div className="text-xs font-mono mb-1" style={{ color: stage.color }}>STAGE {stage.number}</div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2">{stage.title}</h1>
              <p className="text-text-secondary leading-relaxed mb-4">{stage.description}</p>

              {/* Progress */}
              <div className="flex items-center gap-6 text-sm">
                <span className="text-text-muted"><span className="font-bold text-text-primary">{completedCount}/{stage.lessons.length}</span> lessons</span>
                <span className="text-text-muted"><span className="font-bold text-text-primary">{completedHW}/{stageHomework.length}</span> homework</span>
              </div>
              <div className="progress-bar-container h-2 mt-3 max-w-md">
                <div className="h-full rounded" style={{ width: `${stage.lessons.length > 0 ? (completedCount / stage.lessons.length) * 100 : 0}%`, background: stage.color, transition: 'width 0.6s ease' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4">Lessons</h2>
            <div className="space-y-4">
              {stage.lessons.map((lesson, idx) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="glass-card p-5 flex items-start gap-4 group block">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{
                      background: isCompleted ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : 'rgba(255,255,255,0.05)',
                      color: isCompleted ? '#0a0e17' : stage.color,
                    }}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-text-primary group-hover:text-cyber-green transition-colors">{lesson.title}</h3>
                      <p className="text-sm text-text-secondary mt-1">{lesson.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-text-muted font-mono">⏱ {lesson.duration}</span>
                        <span className="text-xs text-text-muted">{lesson.resources.length} resources</span>
                        <span className="text-xs text-text-muted">{lesson.homeworkIds.length} homework</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-cyber-green opacity-0 group-hover:opacity-100 transition-opacity self-center">Open →</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Topics */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {stage.topics.map(topic => (
                  <span key={topic} className="px-2.5 py-1 rounded-md text-xs font-medium text-text-secondary" style={{ background: 'rgba(255,255,255,0.05)', borderLeft: `2px solid ${stage.color}` }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Learning Sources</h3>
              <div className="space-y-3">
                {stage.sources.map(source => (
                  <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-cyber-green transition-colors group">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green shrink-0"></span>
                    <span>{source.name}</span>
                    <span className="text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Stage Homework */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Homework ({stageHomework.length})</h3>
              <div className="space-y-2">
                {stageHomework.slice(0, 5).map(hw => (
                  <Link key={hw.id} href={`/homework/${hw.id}`} className="flex items-center justify-between py-2 group">
                    <span className="text-xs text-text-secondary group-hover:text-cyber-green transition-colors truncate pr-2">{hw.title}</span>
                    <span className={`badge badge-${hw.difficulty} text-[10px] shrink-0`}>{hw.difficulty.slice(0, 3)}</span>
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
