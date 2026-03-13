'use client';

import { useState } from 'react';
import { resources } from '@/data/resources';

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all', ...new Set(resources.map(r => r.category))];

  const filtered = activeCategory === 'all' ? resources : resources.filter(r => r.category === activeCategory);

  const typeIcons: Record<string, string> = {
    documentation: '📄',
    github: '📦',
    video: '🎥',
    platform: '🎮',
    blog: '📰',
    tool: '🔧',
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Resource <span className="gradient-text">Aggregator</span></h1>
          <p className="text-text-secondary">Curated open-source cybersecurity resources — documentation, GitHub repos, platforms, videos, and more.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30'
                  : 'text-text-muted hover:text-text-primary border border-transparent hover:border-border-dim'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(resource => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 group block"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{typeIcons[resource.type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-text-primary group-hover:text-cyber-green transition-colors">{resource.title}</h3>
                  <span className="text-xs text-text-muted capitalize">{resource.type}</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">{resource.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] text-text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>{tag}</span>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border-dim">
                <span className="text-xs text-cyber-green opacity-0 group-hover:opacity-100 transition-opacity font-medium">Visit Resource ↗</span>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <p>No resources found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
