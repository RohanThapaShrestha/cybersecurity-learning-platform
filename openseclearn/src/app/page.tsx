import Link from 'next/link';
import { stages } from '@/data/stages';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00ff88, transparent)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #00d4ff, transparent)', filter: 'blur(80px)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-border-dim" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-slow"></span>
              <span className="text-text-secondary">100% Free &middot; Open Source &middot; Community-Driven</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Learn <span className="gradient-text">Cybersecurity</span>
              <br />
              From Zero to Pro
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              A structured learning roadmap that guides you from complete beginner to cybersecurity professional — using only free, open-source educational content.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/roadmap" className="btn-primary text-base px-8 py-3.5">
                Start Learning →
              </Link>
              <Link href="/dashboard" className="btn-secondary text-base px-8 py-3.5">
                View Dashboard
              </Link>
            </div>

            {/* Terminal Preview */}
            <div className="terminal-card max-w-2xl mx-auto text-left">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ff5f57' }}></div>
                <div className="terminal-dot" style={{ background: '#ffbd2e' }}></div>
                <div className="terminal-dot" style={{ background: '#28c840' }}></div>
                <span className="text-xs text-text-muted ml-2 font-mono">openseclearn@terminal</span>
              </div>
              <div className="terminal-body text-sm">
                <p><span className="text-cyber-cyan">$</span> whoami</p>
                <p className="text-text-secondary">cybersecurity-learner</p>
                <p className="mt-3"><span className="text-cyber-cyan">$</span> cat roadmap.txt</p>
                <p className="text-text-secondary">Fundamentals → Networking → Linux → Programming → Web Security → Ethical Hacking</p>
                <p className="mt-3"><span className="text-cyber-cyan">$</span> ./start-learning.sh</p>
                <p className="text-cyber-green">✓ Loading 6 stages, 14 lessons, 20+ homework tasks...</p>
                <p className="text-cyber-green">✓ All resources are free and open-source</p>
                <p className="text-cyber-green">✓ Ready to begin. <span className="animate-pulse-slow">█</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-y border-border-dim" style={{ background: 'rgba(17, 24, 39, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '6', label: 'Learning Stages' },
              { value: '14+', label: 'Lessons' },
              { value: '20+', label: 'Homework Tasks' },
              { value: '25+', label: 'Curated Resources' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Stages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Your Learning <span className="gradient-text">Roadmap</span></h2>
            <p className="text-text-secondary max-w-xl mx-auto">Six structured stages from foundations to advanced topics. Each stage builds on the previous one.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stages.map((stage, idx) => (
              <Link key={stage.id} href={`/stages/${stage.id}`} className="glass-card p-6 group block">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{stage.icon}</div>
                  <div>
                    <div className="text-xs font-mono text-text-muted mb-1">STAGE {stage.number}</div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-cyber-green transition-colors">{stage.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{stage.description}</p>
                <div className="flex flex-wrap gap-2">
                  {stage.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-2.5 py-1 rounded-md text-xs font-medium text-text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {topic}
                    </span>
                  ))}
                  {stage.topics.length > 3 && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium text-text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      +{stage.topics.length - 3} more
                    </span>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border-dim flex items-center justify-between">
                  <span className="text-xs text-text-muted">{stage.lessons.length} lessons</span>
                  <span className="text-xs font-medium text-cyber-green opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: 'rgba(17, 24, 39, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Platform <span className="gradient-text-warm">Features</span></h2>
            <p className="text-text-secondary max-w-xl mx-auto">Everything you need to go from cybersecurity beginner to professional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Learning Dashboard', desc: 'Track your progress, completed lessons, pending homework, and get personalized recommendations.' },
              { icon: '🗺️', title: 'Skill Tree Roadmap', desc: 'Visual cybersecurity roadmap that unlocks topics as you progress through each stage.' },
              { icon: '📝', title: 'Homework System', desc: 'Practice-based learning with tasks, hints, and detailed solutions for every lesson.' },
              { icon: '🔧', title: 'Tool Library', desc: 'Comprehensive guides for essential security tools — installation, commands, and real use cases.' },
              { icon: '📚', title: 'Resource Aggregator', desc: 'Curated open-source resources, GitHub repos, documentation, and video playlists.' },
              { icon: '🤖', title: 'AI Mentor', desc: 'Get help with security concepts, homework guidance, and personalized learning paths.' },
            ].map(feature => (
              <div key={feature.title} className="glass-card p-6 group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00ff88, transparent)', filter: 'blur(60px)' }} />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Start Your <span className="gradient-text">Journey</span>?</h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">Join thousands of learners securing the digital world with free, open-source education.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/roadmap" className="btn-primary text-base px-8 py-3.5">
                  View Roadmap →
                </Link>
                <Link href="/tools" className="btn-secondary text-base px-8 py-3.5">
                  Explore Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
