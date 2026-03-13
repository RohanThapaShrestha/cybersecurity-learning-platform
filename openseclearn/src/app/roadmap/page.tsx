'use client';

import Link from 'next/link';
import { stages } from '@/data/stages';
import { useProgress } from '@/hooks/useProgress';

export default function Roadmap() {
  const { progress, isLoaded } = useProgress();

  const getStageStatus = (stageIdx: number, stage: typeof stages[0]) => {
    const completedInStage = stage.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    const total = stage.lessons.length;
    if (completedInStage === total && total > 0) return 'completed';
    if (completedInStage > 0) return 'active';
    // First incomplete stage after completed ones
    if (stageIdx === 0) return 'active';
    const prevStage = stages[stageIdx - 1];
    const prevCompleted = prevStage.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    if (prevCompleted === prevStage.lessons.length) return 'active';
    return 'locked';
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Cybersecurity <span className="gradient-text">Skill Tree</span></h1>
          <p className="text-text-secondary max-w-lg mx-auto">Your structured path from beginner to cybersecurity professional. Complete each stage to unlock the next.</p>
        </div>

        {/* Skill Tree */}
        <div className="relative">
          {/* Vertical Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: 'linear-gradient(to bottom, #00ff88, #00d4ff, #9d00ff, #ff0055, #ff6b00, #ffcc00)' }}></div>

          <div className="space-y-8 md:space-y-12">
            {stages.map((stage, idx) => {
              const status = isLoaded ? getStageStatus(idx, stage) : 'locked';
              const completedLessons = stage.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
              const progressPct = stage.lessons.length > 0 ? Math.round((completedLessons / stage.lessons.length) * 100) : 0;
              const isEven = idx % 2 === 0;

              return (
                <div key={stage.id} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Node dot on the line */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full items-center justify-center text-xl border-2" style={{
                    background: status === 'completed' ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : status === 'active' ? '#1a1f2e' : '#111827',
                    borderColor: status === 'completed' ? '#00ff88' : status === 'active' ? stage.color : '#1e293b',
                    boxShadow: status !== 'locked' ? `0 0 15px ${stage.color}33` : 'none',
                  }}>
                    {status === 'completed' ? '✓' : stage.icon}
                  </div>

                  {/* Card */}
                  <div className={`w-full md:w-[calc(50%-40px)] ${isEven ? 'md:pr-0' : 'md:pl-0'}`}>
                    <Link href={`/stages/${stage.id}`} className={`skill-node block ${status} group`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl md:hidden">{stage.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono" style={{ color: stage.color }}>STAGE {stage.number}</span>
                            {status === 'completed' && <span className="badge badge-beginner text-[10px]">✓ Complete</span>}
                            {status === 'locked' && <span className="text-xs text-text-muted">🔒 Locked</span>}
                          </div>
                          <h3 className="text-lg font-bold text-text-primary group-hover:text-cyber-green transition-colors">{stage.title}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-text-secondary mb-4">{stage.subtitle}</p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {stage.topics.map(topic => (
                          <span key={topic} className="px-2 py-0.5 rounded text-[11px] text-text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>{topic}</span>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                        <span>{completedLessons}/{stage.lessons.length} lessons</span>
                        <span className="font-mono" style={{ color: stage.color }}>{progressPct}%</span>
                      </div>
                      <div className="progress-bar-container h-1.5">
                        <div className="h-full rounded" style={{ width: `${progressPct}%`, background: stage.color, transition: 'width 0.6s ease' }}></div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End Badge */}
          <div className="flex justify-center mt-12">
            <div className="glass-card px-6 py-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm font-bold gradient-text">Cybersecurity Professional</p>
              <p className="text-xs text-text-muted mt-1">Complete all stages to achieve this rank</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
