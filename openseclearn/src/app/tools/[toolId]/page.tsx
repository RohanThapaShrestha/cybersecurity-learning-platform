import Link from 'next/link';
import { tools } from '@/data/tools';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return tools.map(tool => ({ toolId: tool.id }));
}

export default async function ToolDetailPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  const tool = tools.find(t => t.id === toolId);

  if (!tool) notFound();

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/tools" className="hover:text-cyber-green transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-text-primary">{tool.name}</span>
        </div>

        {/* Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-start gap-5">
            <span className="text-5xl">{tool.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black mb-1">{tool.name}</h1>
              <span className="text-sm text-text-muted">{tool.category}</span>
              <p className="text-text-secondary mt-3 leading-relaxed">{tool.description}</p>
              <a href={tool.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm text-cyber-green hover:underline">
                {tool.website} ↗
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Installation */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">📦 Installation</h2>
              <div className="space-y-3">
                {tool.installation.map((inst, i) => (
                  <div key={i}>
                    <span className="text-xs text-text-muted mb-1 block">{inst.platform}</span>
                    <div className="terminal-card">
                      <div className="terminal-header py-2 px-3">
                        <div className="terminal-dot" style={{ background: '#ff5f57', width: 8, height: 8 }}></div>
                        <div className="terminal-dot" style={{ background: '#ffbd2e', width: 8, height: 8 }}></div>
                        <div className="terminal-dot" style={{ background: '#28c840', width: 8, height: 8 }}></div>
                      </div>
                      <div className="px-4 py-3 font-mono text-sm text-cyber-green">
                        <span className="text-cyber-cyan">$</span> {inst.command}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commands */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">⚡ Command Reference</h2>
              <div className="space-y-3">
                {tool.commands.map((cmd, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border-dim" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <code className="text-sm font-mono text-cyber-green block mb-1">{cmd.command}</code>
                    <p className="text-xs text-text-muted">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Use Cases */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Use Cases</h3>
              <div className="space-y-2">
                {tool.useCases.map((uc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green mt-1.5 shrink-0"></span>
                    <p className="text-sm text-text-secondary">{uc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Category</span>
                  <span className="text-text-primary">{tool.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Commands</span>
                  <span className="text-text-primary">{tool.commands.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Platforms</span>
                  <span className="text-text-primary">{tool.installation.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
