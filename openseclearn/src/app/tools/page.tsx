import Link from 'next/link';
import { tools } from '@/data/tools';

export default function ToolsPage() {
  const categories = [...new Set(tools.map(t => t.category))];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Cybersecurity <span className="gradient-text">Tool Library</span></h1>
          <p className="text-text-secondary">Essential security tools with installation guides, command references, and real-world use cases.</p>
        </div>

        {/* Category sections */}
        {categories.map(cat => (
          <div key={cat} className="mb-12">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => t.category === cat).map(tool => (
                <Link key={tool.id} href={`/tools/${tool.id}`} className="glass-card p-6 group block">
                  <div className="flex items-start gap-4 mb-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-cyber-green transition-colors">{tool.name}</h3>
                      <span className="text-xs text-text-muted">{tool.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">{tool.description}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{tool.commands.length} commands</span>
                    <span className="text-cyber-green opacity-0 group-hover:opacity-100 transition-opacity font-medium">View Guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
