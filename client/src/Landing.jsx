import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Easing tokens from Emil Kowalski's framework ── */
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

/* ── IntersectionObserver hook for scroll reveals ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.15, rootMargin: '-60px', ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 600ms ${EASE_OUT} ${delay}ms, transform 600ms ${EASE_OUT} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Feature data ── */
const FEATURES = [
  {
    icon: 'wb_sunny',
    title: 'Brief',
    desc: 'AI synthesizes Gmail, Calendar, Slack, and GitHub into a single executive briefing every morning.',
    tag: 'INTELLIGENCE',
  },
  {
    icon: 'query_stats',
    title: 'Decide',
    desc: 'Feed it parameters and a proposal. It returns a verdict — PROCEED, REVISE, or ABORT — with confidence scores.',
    tag: 'STRATEGY',
  },
  {
    icon: 'hub',
    title: 'Search',
    desc: 'Type a question. Get a live knowledge graph that maps how concepts, tasks, and milestones connect.',
    tag: 'TOPOLOGY',
  },
  {
    icon: 'description',
    title: 'Docs',
    desc: 'Upload any media. Receive an executive summary, strategic suggestions, and structured entity extraction.',
    tag: 'ANALYSIS',
  },
];

const ADVANTAGES = [
  { icon: 'speed', title: 'Real-Time AI', desc: 'Powered by Google Gemini. Every insight is generated live, never cached.' },
  { icon: 'lock', title: 'Secure by Default', desc: 'Email and password authentication via Supabase. Your data stays yours.' },
  { icon: 'cloud_sync', title: 'Cloud Native', desc: 'Deployed on Vercel + Render. Zero downtime, automatic scaling.' },
  { icon: 'integration_instructions', title: 'Multi-Platform', desc: 'Connects Gmail, Google Calendar, GitHub, and Slack in one unified view.' },
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
    <div className="bg-background text-on-background font-body-md text-body-md antialiased overflow-x-hidden">

      {/* ═══════════ STICKY NAV ═══════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-margin-mobile md:px-margin-desktop border-b border-primary bg-background/90 backdrop-blur-sm"
        style={{
          height: headerShrunk ? '56px' : '72px',
          transition: `height 250ms ${EASE_OUT}`,
        }}
      >
        <h1 className="font-headline-md text-headline-md font-bold text-primary">Pulse OS</h1>
        <div className="flex gap-sm">
          <button
            onClick={() => navigate('/login')}
            className="black-border bg-white text-primary font-label-caps text-label-caps uppercase px-sm py-xs hover:bg-secondary-container transition-colors duration-200 cursor-pointer"
            style={{ transition: `background-color 200ms ease, transform 160ms ${EASE_OUT}` }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="black-border bg-primary text-on-primary font-label-caps text-label-caps uppercase px-sm py-xs hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 cursor-pointer"
            style={{ transition: `background-color 200ms ease, transform 160ms ${EASE_OUT}` }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop pt-[72px]">
        <p
          className="font-label-caps text-label-caps text-secondary uppercase mb-md"
          style={{
            opacity: 0,
            animation: `heroFadeIn 600ms ${EASE_OUT} 200ms forwards`,
          }}
        >
          System Intelligence for Modern Teams
        </p>

        <h2
          className="font-display text-display text-primary max-w-4xl leading-tight"
          style={{
            opacity: 0,
            animation: `heroFadeIn 800ms ${EASE_OUT} 400ms forwards`,
          }}
        >
          Your Operating<br />System for Work
        </h2>

        <p
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-md"
          style={{
            opacity: 0,
            animation: `heroFadeIn 800ms ${EASE_OUT} 600ms forwards`,
          }}
        >
          Pulse OS unifies your email, calendar, code, and communications into a single AI‑powered command center.
          Make decisions faster. See everything. Miss nothing.
        </p>

        <div
          className="flex gap-sm mt-lg"
          style={{
            opacity: 0,
            animation: `heroFadeIn 800ms ${EASE_OUT} 800ms forwards`,
          }}
        >
          <button
            onClick={() => navigate('/login')}
            className="black-border bg-primary text-on-primary font-label-caps text-label-caps uppercase px-md py-sm hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 cursor-pointer"
            style={{ transition: `background-color 200ms ease, transform 160ms ${EASE_OUT}` }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Launch Console
            </span>
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="black-border bg-white text-primary font-label-caps text-label-caps uppercase px-md py-sm hover:bg-secondary-container transition-colors duration-200 cursor-pointer"
            style={{ transition: `background-color 200ms ease, transform 160ms ${EASE_OUT}` }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Explore Features
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-auto mb-md"
          style={{
            opacity: 0,
            animation: `heroFadeIn 800ms ${EASE_OUT} 1200ms forwards`,
          }}
        >
          <span
            className="material-symbols-outlined text-secondary text-[28px]"
            style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
          >
            keyboard_arrow_down
          </span>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto">
        <Reveal>
          <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs text-center">Core Modules</p>
          <h3 className="font-headline-lg text-headline-lg text-primary text-center mb-lg">Four pillars of intelligence</h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="black-border bg-surface p-md flex flex-col gap-sm group hover:bg-secondary-container transition-colors duration-200 h-full">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[28px] text-primary">{f.icon}</span>
                  <span className="font-label-caps text-[10px] text-secondary border border-secondary-container px-2 py-0.5">{f.tag}</span>
                </div>
                <h4 className="font-headline-md text-headline-md font-bold text-primary">{f.title}</h4>
                <p className="text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto">
        <Reveal>
          <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs text-center">Protocol</p>
          <h3 className="font-headline-lg text-headline-lg text-primary text-center mb-lg">How Pulse OS works</h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[
            { step: '01', title: 'Connect', desc: 'Link your Gmail, Calendar, GitHub, and Slack accounts in one click.', icon: 'link' },
            { step: '02', title: 'Analyze', desc: 'Gemini AI processes your data streams in real time, extracting patterns and priorities.', icon: 'analytics' },
            { step: '03', title: 'Act', desc: 'Receive actionable briefs, strategic verdicts, and knowledge graphs. Make confident decisions.', icon: 'bolt' },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 100}>
              <div className="flex flex-col items-center text-center gap-sm p-md">
                <div className="w-16 h-16 black-border bg-primary text-on-primary flex items-center justify-center mb-xs">
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
      <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs text-center">Architecture</p>
            <h3 className="font-headline-lg text-headline-lg text-primary text-center mb-lg">Built for the real world</h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <div className="flex flex-col gap-xs p-sm">
                  <span className="material-symbols-outlined text-[24px] text-primary mb-xs">{a.icon}</span>
                  <h4 className="font-headline-md text-headline-md font-bold text-primary text-sm">{a.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop">
        <Reveal>
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-md">
            <h3 className="font-headline-lg text-headline-lg text-primary">Ready to take control?</h3>
            <p className="text-on-surface-variant max-w-lg">
              Stop switching between tabs. Pulse OS brings your entire work life into one command center powered by AI.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="black-border bg-primary text-on-primary font-label-caps text-label-caps uppercase px-lg py-sm hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 cursor-pointer"
              style={{ transition: `background-color 200ms ease, transform 160ms ${EASE_OUT}` }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                Enter Pulse OS
              </span>
            </button>
          </div>
        </Reveal>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-primary py-md px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-sm">
          <p className="font-label-caps text-label-caps text-secondary">© 2026 Pulse OS — System Intelligence</p>
          <p className="font-label-caps text-label-caps text-secondary">Built with Gemini AI · Supabase · React</p>
        </div>
      </footer>

      {/* ═══════════ GLOBAL KEYFRAMES ═══════════ */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
