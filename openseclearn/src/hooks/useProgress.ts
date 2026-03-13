'use client';

import { useState, useEffect, useCallback } from 'react';

interface Progress {
  completedLessons: string[];
  completedHomework: string[];
  currentStage: string;
  streak: number;
  lastActivity: string;
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  completedHomework: [],
  currentStage: 'fundamentals',
  streak: 0,
  lastActivity: '',
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('openseclearn-progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((updated: Progress) => {
    setProgress(updated);
    try {
      localStorage.setItem('openseclearn-progress', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updated = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastActivity: new Date().toISOString(),
      };
      save(updated);
      return updated;
    });
  }, [save]);

  const completeHomework = useCallback((homeworkId: string) => {
    setProgress(prev => {
      if (prev.completedHomework.includes(homeworkId)) return prev;
      const updated = {
        ...prev,
        completedHomework: [...prev.completedHomework, homeworkId],
        lastActivity: new Date().toISOString(),
      };
      save(updated);
      return updated;
    });
  }, [save]);

  const setCurrentStage = useCallback((stageId: string) => {
    setProgress(prev => {
      const updated = { ...prev, currentStage: stageId };
      save(updated);
      return updated;
    });
  }, [save]);

  const resetProgress = useCallback(() => {
    save(DEFAULT_PROGRESS);
  }, [save]);

  const totalLessons = 14;
  const totalHomework = 20;
  const overallProgress = isLoaded
    ? Math.round(((progress.completedLessons.length + progress.completedHomework.length) / (totalLessons + totalHomework)) * 100)
    : 0;

  return {
    progress,
    isLoaded,
    completeLesson,
    completeHomework,
    setCurrentStage,
    resetProgress,
    overallProgress,
    totalLessons,
    totalHomework,
  };
}
