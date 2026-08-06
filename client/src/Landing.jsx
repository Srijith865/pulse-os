import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── IntersectionObserver hook ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.12, rootMargin: '-40px', ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 700ms cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 700ms cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  { icon: 'wb_sunny', title: 'Brief', desc: 'AI synthesizes Gmail, Calendar, Slack, and GitHub into a single executive briefing every morning.', tag: 'INTELLIGENCE' },
  { icon: 'query_stats', title: 'Decide', desc: 'Feed it parameters and a proposal. Get a verdict — PROCEED, REVISE, or ABORT — with confidence scores.', tag: 'STRATEGY' },
  { icon: 'hub', title: 'Search', desc: 'Type a question. Get a live knowledge graph mapping how concepts, tasks, and milestones connect.', tag: 'TOPOLOGY' },
  { icon: 'description', title: 'Docs', desc: 'Upload any media. Receive an executive summary, strategic suggestions, and entity extraction.', tag: 'ANALYSIS' },
];

const ADVANTAGES = [
  { icon: 'speed', title: 'Real-Time AI', desc: 'Powered by Google Gemini. Every insight is generated live.' },
  { icon: 'lock', title: 'Secure Auth', desc: 'Email & password authentication via Supabase.' },
  { icon: 'cloud_sync', title: 'Cloud Native', desc: 'Deployed on Vercel + Render. Zero downtime.' },
  { icon: 'integration_instructions', title: 'Multi-Platform', desc: 'Gmail, Calendar, GitHub, Slack in one view.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [headerShrunk, setHeaderShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderShrunk(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="text-on-background font-body-md text-body-md antialiased overflow-x-hidden relative">

      {/* Ambient gradient blobs */}
      <div className="gradient-blob" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', top: '-200px', right: '-100px' }} />
      <div className="gradient-blob" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', bottom: '-300px', left: '-150px', animationDelay: '-10s' }} />

      {/* ═══════════ NAV ═══════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-margin-mobile md:px-margin-desktop glass-card"
        style={{
          height: headerShrunk ? '56px' : '72px',
          transition: 'height 250ms cubic-bezier(0.23,1,0.32,1)',
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        }}
      >
        <h1 className="font-headline-md text-headline-md font-bold text-primary">Pulse OS</h1>
        <div className="flex gap-xs">
          <button onClick={() => navigate('/login')} className="press-feedback px-sm py-xs font-label-caps text-label-caps uppercase text-primary bg-white/60 border border-black/10 rounded-lg hover:bg-white transition-colors cursor-pointer">
            Login
          </button>
          <button onClick={() => navigate('/login')} className="press-feedback px-sm py-xs font-label-caps text-label-caps uppercase bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Get Started
          </button>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop pt-[72px] relative z-10 dot-grid">
        <div className="stagger-children flex flex-col items-center">
          <span className="tag-pill mb-md">
            <span className="material-symbols-outlined text-[14px] mr-1">auto_awesome</span>
            AI-Powered System Intelligence
          </span>

          <h2 className="font-display text-display text-primary max-w-4xl leading-tight">
            Your Operating System<br />
            <span className="gradient-text">for Work</span>
          </h2>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-md">
            Pulse OS unifies your email, calendar, code, and communications into a single AI‑powered command center.
            Make decisions faster. See everything. Miss nothing.
          </p>

          <div className="flex gap-sm mt-lg">
            <button onClick={() => navigate('/login')} className="press-feedback bg-primary text-on-primary font-label-caps text-label-caps uppercase px-md py-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 glow-md">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Launch Console
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="press-feedback bg-white/70 text-primary font-label-caps text-label-caps uppercase px-md py-sm rounded-lg border border-black/10 hover:bg-white transition-colors cursor-pointer">
              Explore Features
            </button>
          </div>
        </div>

        <div className="mt-auto mb-lg" style={{ opacity: 0, animation: 'heroFadeIn 800ms cubic-bezier(0.23,1,0.32,1) 1200ms forwards' }}>
          <span className="material-symbols-outlined text-secondary/50 text-[28px]" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>
            keyboard_arrow_down
          </span>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto relative z-10">
        <Reveal>
          <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs text-center">Core Modules</p>
          <h3 className="font-headline-lg text-headline-lg text-primary text-center mb-lg">Four pillars of intelligence</h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="glass-card rounded-2xl p-md flex flex-col gap-sm hover-lift cursor-default h-full">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px] gradient-text">{f.icon}</span>
                  </div>
                  <span className="tag-pill">{f.tag}</span>
                </div>
                <h4 className="font-headline-md text-headline-md font-bold text-primary">{f.title}</h4>
                <p className="text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto relative z-10">
        <Reveal>
          <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs text-center">Protocol</p>
          <h3 className="font-headline-lg text-headline-lg text-primary text-center mb-lg">How Pulse OS works</h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[
            { step: '01', title: 'Connect', desc: 'Link your Gmail, Calendar, GitHub, and Slack in one click.', icon: 'link' },
            { step: '02', title: 'Analyze', desc: 'Gemini AI processes your data streams in real time.', icon: 'analytics' },
            { step: '03', title: 'Act', desc: 'Receive actionable briefs, verdicts, and knowledge graphs.', icon: 'bolt' },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 100}>
              <div className="flex flex-col items-center text-center gap-sm p-md glass-card rounded-2xl hover-lift">
                <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-xs glow-sm">
                  <span className="material-symbols-outlined text-[32px]">{s.icon}</span>
                </div>
                <span className="font-label-caps text-label-caps text-secondary">{s.step}</span>
                <h4 className="font-headline-md text-headline-md font-bold text-primary">{s.title}</h4>
                <p className="text-on-surface-variant">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ ADVANTAGES ═══════════ */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs text-center">Architecture</p>
            <h3 className="font-headline-lg text-headline-lg text-primary text-center mb-lg">Built for the real world</h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <div className="flex flex-col gap-xs p-md glass-card rounded-2xl hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-xs">
                    <span className="material-symbols-outlined text-[20px] gradient-text">{a.icon}</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md font-bold text-primary text-sm">{a.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop relative z-10">
        <Reveal>
          <div className="max-w-[800px] mx-auto text-center glass-card-lg rounded-3xl p-lg flex flex-col items-center gap-md">
            <h3 className="font-headline-lg text-headline-lg text-primary">Ready to take control?</h3>
            <p className="text-on-surface-variant max-w-lg">
              Stop switching between tabs. Pulse OS brings your entire work life into one command center powered by AI.
            </p>
            <button onClick={() => navigate('/login')} className="press-feedback bg-primary text-on-primary font-label-caps text-label-caps uppercase px-lg py-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 glow-md">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              Enter Pulse OS
            </button>
          </div>
        </Reveal>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-black/5 py-md px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-sm">
          <p className="font-label-caps text-label-caps text-secondary">© 2026 Pulse OS — System Intelligence</p>
          <p className="font-label-caps text-label-caps text-secondary">Built with Gemini AI · Supabase · React</p>
        </div>
      </footer>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}
