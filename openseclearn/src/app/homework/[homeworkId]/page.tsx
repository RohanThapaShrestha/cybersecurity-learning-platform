'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { homework } from '@/data/homework';
import { stages } from '@/data/stages';
import { useProgress } from '@/hooks/useProgress';

export default function HomeworkDetailPage() {
  const params = useParams();
  const homeworkId = params.homeworkId as string;
  const hw = homework.find(h => h.id === homeworkId);
  const { progress, completeHomework } = useProgress();

  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [answer, setAnswer] = useState('');

  if (!hw) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Homework Not Found</h1>
          <Link href="/homework" className="text-cyber-green hover:underline">← Back to Homework</Link>
        </div>
      </div>
    );
  }

  const stage = stages.find(s => s.id === hw.stageId);
  const isCompleted = progress.completedHomework.includes(hw.id);
  const allLessons = stages.flatMap(s => s.lessons);
  const lesson = allLessons.find(l => l.id === hw.lessonId);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
          <Link href="/homework" className="hover:text-cyber-green transition-colors">Homework</Link>
          <span>/</span>
          <span className="text-text-primary">{hw.title}</span>
        </div>

        {/* Header */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge badge-${hw.difficulty}`}>{hw.difficulty}</span>
                {stage && <span className="text-xs font-mono" style={{ color: stage.color }}>Stage {stage.number}</span>}
                {isCompleted && <span className="badge badge-beginner">✓ Done</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">{hw.title}</h1>
            </div>
          </div>
          {lesson && (
            <p className="text-sm text-text-muted">
              Related to: <Link href={`/lessons/${lesson.id}`} className="text-cyber-green hover:underline">{lesson.title}</Link>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Description */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-3">📋 Task Description</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{hw.description}</p>
            </div>

            {/* Expected Output */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-3">🎯 Expected Output</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{hw.expectedOutput}</p>
            </div>

            {/* Your Answer */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-3">✏️ Your Answer</h2>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full h-40 px-4 py-3 rounded-lg bg-bg-secondary border border-border-dim text-text-primary text-sm font-mono focus:outline-none focus:border-cyber-green resize-y"
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-text-muted">{answer.length} characters</p>
                <button
                  onClick={() => completeHomework(hw.id)}
                  disabled={isCompleted}
                  className={isCompleted ? 'btn-secondary text-sm px-4 py-2 opacity-50 cursor-not-allowed' : 'btn-primary text-sm px-4 py-2'}
                >
                  {isCompleted ? '✓ Marked Complete' : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Hints */}
            <div className="glass-card p-6">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-bold">💡 Hints ({hw.hints.length})</h2>
                <span className="text-sm text-cyber-green">{showHints ? 'Hide' : 'Show'}</span>
              </button>
              {showHints && (
                <div className="mt-4 space-y-2">
                  {hw.hints.map((hint, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
                      <span className="text-sm font-bold text-cyber-green shrink-0">#{i + 1}</span>
                      <p className="text-sm text-text-secondary">{hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solution */}
            <div className="glass-card p-6">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-bold">🔑 Solution</h2>
                <span className="text-sm text-cyber-orange">{showSolution ? 'Hide' : 'Reveal'}</span>
              </button>
              {!showSolution && (
                <p className="text-sm text-text-muted mt-3">Try to solve it yourself first. Click &quot;Reveal&quot; to see the solution.</p>
              )}
              {showSolution && (
                <div className="mt-4 p-4 rounded-lg text-sm text-text-secondary leading-relaxed whitespace-pre-line" style={{ background: 'rgba(255, 107, 0, 0.05)', borderLeft: '3px solid #ff6b00' }}>
                  {hw.solution}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Difficulty</span>
                  <span className={`badge badge-${hw.difficulty} text-[10px]`}>{hw.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Hints</span>
                  <span className="text-text-primary">{hw.hints.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <span className={isCompleted ? 'text-cyber-green' : 'text-text-muted'}>{isCompleted ? 'Complete' : 'Pending'}</span>
                </div>
                {stage && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Stage</span>
                    <span className="text-text-primary">{stage.number}</span>
                  </div>
                )}
              </div>
            </div>

            {lesson && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Related Lesson</h3>
                <Link href={`/lessons/${lesson.id}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>📖</div>
                  <span className="text-sm text-text-secondary group-hover:text-cyber-green transition-colors">{lesson.title}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
