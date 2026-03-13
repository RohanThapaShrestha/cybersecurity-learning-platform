'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { stages } from '@/data/stages';
import { homework } from '@/data/homework';
import { useProgress } from '@/hooks/useProgress';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const allLessons = stages.flatMap(s => s.lessons.map(l => ({ ...l, stage: s })));
  const lessonData = allLessons.find(l => l.id === lessonId);
  const { progress, completeLesson } = useProgress();

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
          <Link href="/roadmap" className="text-cyber-green hover:underline">← Back to Roadmap</Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress.completedLessons.includes(lessonId);
  const relatedHW = homework.filter(h => lessonData.homeworkIds.includes(h.id));

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-text-primary">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-3 gradient-text">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mt-6 mb-4">{line.slice(2)}</h1>;
      // Code blocks
      if (line.startsWith('```')) return <div key={i} className="my-1"></div>;
      // List items
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) return <li key={i} className="ml-4 text-sm text-text-secondary mb-1"><span className="font-semibold text-text-primary">{match[1]}</span>{match[2] ? `: ${match[2]}` : ''}</li>;
      }
      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm text-text-secondary mb-1">{line.slice(2)}</li>;
      if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 text-sm text-text-secondary mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      // Table rows
      if (line.startsWith('|') && !line.includes('---')) {
        const cells = line.split('|').filter(c => c.trim());
        return (
          <div key={i} className="grid gap-4 text-xs text-text-secondary py-1.5 border-b border-border-dim" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
            {cells.map((cell, j) => <span key={j} className={j === 0 ? 'font-mono text-text-primary' : ''}>{cell.trim()}</span>)}
          </div>
        );
      }
      // Code lines
      if (line.startsWith('`') && line.endsWith('`')) {
        return <code key={i} className="block px-3 py-1 my-1 rounded text-sm font-mono text-cyber-green" style={{ background: 'rgba(0,0,0,0.4)' }}>{line.slice(1, -1)}</code>;
      }
      // Empty lines
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      // Paragraphs
      return <p key={i} className="text-sm text-text-secondary leading-relaxed mb-1">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
          <Link href="/roadmap" className="hover:text-cyber-green transition-colors">Roadmap</Link>
          <span>/</span>
          <Link href={`/stages/${lessonData.stage.id}`} className="hover:text-cyber-green transition-colors">{lessonData.stage.title}</Link>
          <span>/</span>
          <span className="text-text-primary">{lessonData.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black mb-2">{lessonData.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="font-mono">⏱ {lessonData.duration}</span>
                    <span style={{ color: lessonData.stage.color }}>Stage {lessonData.stage.number}</span>
                  </div>
                </div>
                {isCompleted && (
                  <span className="badge badge-beginner shrink-0">✓ Completed</span>
                )}
              </div>

              {/* Content */}
              <div className="prose-custom">
                {renderContent(lessonData.content)}
              </div>

              {/* Mark Complete */}
              <div className="mt-10 pt-6 border-t border-border-dim flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  {isCompleted ? 'You have completed this lesson.' : 'Mark this lesson as complete when you\'re done.'}
                </p>
                <button
                  onClick={() => completeLesson(lessonId)}
                  disabled={isCompleted}
                  className={isCompleted ? 'btn-secondary text-sm px-4 py-2 opacity-50 cursor-not-allowed' : 'btn-primary text-sm px-4 py-2'}
                >
                  {isCompleted ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Resources ({lessonData.resources.length})</h3>
              <div className="space-y-3">
                {lessonData.resources.map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-bg-card-hover transition-colors group">
                    <span className="text-sm mt-0.5">
                      {res.type === 'github' ? '📦' : res.type === 'video' ? '🎥' : res.type === 'article' ? '📰' : '📄'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-cyber-green transition-colors">{res.title}</p>
                      <p className="text-xs text-text-muted capitalize">{res.type} ↗</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Related Homework */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Homework ({relatedHW.length})</h3>
              <div className="space-y-2">
                {relatedHW.map(hw => (
                  <Link key={hw.id} href={`/homework/${hw.id}`} className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-bg-card-hover transition-colors group">
                    <span className="text-sm text-text-secondary group-hover:text-cyber-green transition-colors truncate pr-2">{hw.title}</span>
                    <span className={`badge badge-${hw.difficulty} text-[10px] shrink-0`}>{hw.difficulty.slice(0, 3)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stage Info */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Stage</h3>
              <Link href={`/stages/${lessonData.stage.id}`} className="flex items-center gap-3 group">
                <span className="text-2xl">{lessonData.stage.icon}</span>
                <div>
                  <p className="text-sm font-bold text-text-primary group-hover:text-cyber-green transition-colors">{lessonData.stage.title}</p>
                  <p className="text-xs text-text-muted">{lessonData.stage.lessons.length} lessons</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
