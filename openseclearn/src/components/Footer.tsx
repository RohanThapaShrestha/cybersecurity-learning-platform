import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-dim mt-20" style={{ background: 'rgba(10, 14, 23, 0.9)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0e17' }}>◈</div>
              <span className="text-lg font-bold"><span className="gradient-text">Open</span><span className="text-text-primary">SecLearn</span></span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Free, open-source cybersecurity education. Learn from zero to professional using curated open knowledge.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Learning</h4>
            <ul className="space-y-3">
              <li><Link href="/roadmap" className="text-sm text-text-muted hover:text-cyber-green transition-colors">Roadmap</Link></li>
              <li><Link href="/dashboard" className="text-sm text-text-muted hover:text-cyber-green transition-colors">Dashboard</Link></li>
              <li><Link href="/homework" className="text-sm text-text-muted hover:text-cyber-green transition-colors">Homework</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/tools" className="text-sm text-text-muted hover:text-cyber-green transition-colors">Tool Library</Link></li>
              <li><Link href="/resources" className="text-sm text-text-muted hover:text-cyber-green transition-colors">Resource Hub</Link></li>
              <li><a href="https://owasp.org" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-cyber-green transition-colors">OWASP ↗</a></li>
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Open Source</h4>
            <ul className="space-y-3">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-cyber-green transition-colors">GitHub ↗</a></li>
              <li><a href="https://attack.mitre.org" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-cyber-green transition-colors">MITRE ATT&CK ↗</a></li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid rgba(0, 255, 136, 0.25)' }}>
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-slow"></span>
              100% Open Source
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-dim flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © 2024 OpenSecLearn. Built for the cybersecurity community. All learning content is aggregated from open-source resources.
          </p>
          <p className="text-xs text-text-muted font-mono">
            <span className="text-cyber-green">$</span> echo &quot;Stay curious, stay secure&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
