import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FluidBackground from "./FluidBackground";

gsap.registerPlugin(ScrollTrigger);

const MODULES = [
  {
    n: "01",
    tag: "Intelligence",
    name: "Brief",
    body: "Gmail, Calendar, Slack and GitHub synthesized into one prioritized morning briefing. Urgent actions, schedule conflicts, engineering velocity.",
  },
  {
    n: "02",
    tag: "Strategy",
    name: "Decide",
    body: "Feed it your constraints and a proposed initiative. Get back a verdict — PROCEED, REVISE or ABORT — with a confidence score and risk factors.",
  },
  {
    n: "03",
    tag: "Topology",
    name: "Search",
    body: "Ask anything complex. Nodes and edges are generated live and drawn as an interactive knowledge graph of how everything connects.",
  },
  {
    n: "04",
    tag: "Analysis",
    name: "Docs",
    body: "Drop a PDF, image, audio or video. Get an executive summary, three strategic suggestions and structured entities with confidence scores.",
  },
];

const ADVANTAGES = [
  ["Real-Time AI", "Gemini flash-lite streams synthesis as your data changes."],
  ["Secure Auth", "Supabase email auth. No data parked on third-party servers."],
  ["Cloud Native", "Vercel edge frontend, Render backend, Postgres core."],
  ["Multi-Platform", "Gmail, Calendar, GitHub REST, Slack on the way."],
];

export default function Landing() {
  const navigate = useNavigate();
  const container = useRef();
  
  useGSAP(() => {
    // Hero huge text scaling down
    gsap.to(".hero-pulse-text", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      scale: 0.5,
      yPercent: 50,
      opacity: 0,
    });

    // Horizontal scroll for modules
    const panels = gsap.utils.toArray(".module-panel");
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-scroll-section",
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + document.querySelector(".horizontal-scroll-section").offsetWidth
      }
    });

    // Fade in elements for the HOW section
    gsap.utils.toArray(".fade-up").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

  }, { scope: container });

  return (
    <ReactLenis root>
      <main ref={container} className="bg-transparent text-black overflow-hidden relative">
        <FluidBackground />
        
        <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#fbf8ff]/60 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5">
            <span className="label-mono font-medium">Pulse OS ®</span>
            <nav className="label-mono hidden gap-8 text-black/60 md:flex">
              <a href="#modules" className="hover:text-black">Modules</a>
              <a href="#how" className="hover:text-black">How it works</a>
              <a href="#edge" className="hover:text-black">Advantages</a>
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/login')} className="label-mono rounded-full px-4 py-2 hover:bg-black/5 cursor-pointer">Login</button>
              <button
                onClick={() => navigate('/login')}
                className="label-mono rounded-full bg-black px-4 py-2 text-white transition-transform active:scale-[0.97] cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="hero-section relative flex flex-col justify-center items-center min-h-[120vh] px-5 pt-28 pb-6">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <h1 className="hero-pulse-text font-bold text-[35vw] text-indigo-900/15 select-none leading-none tracking-tighter" style={{ fontFamily: 'Hanken Grotesk' }}>
              PULSE
            </h1>
          </div>
          
          <div className="relative z-10 w-full max-w-[1600px] mx-auto text-center mt-32">
            <h1 className="display-xl text-[12vw] leading-[0.82] md:text-[8vw] mb-8">
              Your operating
              <br />
              system <span className="text-black/40">for</span> work
            </h1>
            
            <p className="max-w-md mx-auto text-lg leading-snug text-black/60 mb-12">
              Pulse OS unifies your email, calendar, code and communications into a single
              command center. Make decisions faster. See everything. Miss nothing.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="label-mono rounded-full bg-black px-8 py-4 text-white transition-transform active:scale-[0.97] cursor-pointer"
              >
                Enter Pulse OS →
              </button>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden border-y border-black bg-black py-4 text-white">
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <span key={i} className="label-mono flex items-center gap-8">
                Stop switching tabs <span className="text-indigo-400">✳</span>
                AI that thinks for you <span className="text-indigo-400">✳</span>
                Inbox to insight in seconds <span className="text-indigo-400">✳</span>
              </span>
            ))}
          </div>
        </div>

        {/* HORIZONTAL SCROLL SECTION (MODULES) */}
        <section id="modules" className="horizontal-scroll-section h-screen flex relative overflow-hidden bg-transparent">
          <div className="flex w-[400vw] h-full">
            {MODULES.map((m, i) => (
              <div key={m.n} className="module-panel w-screen h-full flex items-center justify-center px-10 border-r border-black/10">
                <div className="max-w-3xl flex flex-col items-start gap-6 relative">
                  <span className="text-[15vw] font-bold text-indigo-900/10 absolute -top-[50%] -left-[10%] select-none z-0 tracking-tighter" style={{ fontFamily: 'Hanken Grotesk' }}>{m.n}</span>
                  <div className="relative z-10">
                    <span className="label-mono rounded-full border border-black px-3 py-1.5 mb-6 inline-block">
                      {m.tag}
                    </span>
                    <h3 className="display-xl text-6xl md:text-8xl mb-6">{m.name}</h3>
                    <p className="text-xl md:text-3xl leading-relaxed text-black/70 max-w-2xl">
                      {m.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-black/90 text-white relative z-10 py-32 px-5 backdrop-blur-md">
          <div className="mx-auto max-w-[1600px]">
            <p className="label-mono opacity-60 fade-up">[ How it works ]</p>
            <h2 className="display-xl mt-4 text-[10vw] leading-[0.88] md:text-[6vw] fade-up">
              Connect. Analyze. Act.
            </h2>
            <div className="mt-24 grid gap-12 md:grid-cols-3">
              {[
                { n: "01", t: "Connect", b: "Link Gmail, Calendar, GitHub and Slack in one click." },
                { n: "02", t: "Analyze", b: "Gemini processes your data streams in real time." },
                { n: "03", t: "Act", b: "Receive briefs, verdicts and graphs." },
              ].map((s) => (
                <div key={s.n} className="border-t border-white/20 pt-8 fade-up">
                  <span className="label-mono text-indigo-400">{s.n}</span>
                  <h3 className="mt-6 text-4xl font-bold tracking-tight">{s.t}</h3>
                  <p className="mt-4 max-w-xs text-lg leading-relaxed opacity-60">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ADVANTAGES */}
        <section id="edge" className="mx-auto max-w-[1600px] px-5 py-32">
          <div className="grid gap-8 md:grid-cols-12 mb-20 fade-up">
            <p className="label-mono text-black/60 md:col-span-4">[ Advantages ]</p>
            <h2 className="display-xl text-[9vw] leading-[0.88] md:col-span-8 md:text-[5.4vw]">
              Built for speed and clarity
            </h2>
          </div>
          
          <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4 fade-up">
            {ADVANTAGES.map(([t, b]) => (
              <div key={t} className="bg-[#fbf8ff] p-10 hover:bg-white transition-colors cursor-default">
                <h3 className="text-2xl font-bold tracking-tight mb-4">{t}</h3>
                <p className="text-base leading-relaxed text-black/60">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="border-t border-black/10 px-5 py-32 bg-transparent fade-up">
          <div className="mx-auto max-w-[1600px] text-center">
            <h2 className="display-xl text-[13vw] leading-[0.86] md:text-[9vw]">
              Enter Pulse OS
            </h2>
            <p className="mx-auto mt-8 text-xl max-w-md text-black/60">
              Decisions without emotion. Intelligence without tab-switching.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="label-mono mt-12 inline-block rounded-full bg-black px-10 py-5 text-white transition-transform active:scale-[0.97] cursor-pointer"
            >
              Get started — it's free
            </button>
          </div>
        </section>

        <footer className="border-t border-black/10 px-5 py-8 bg-transparent">
          <div className="label-mono mx-auto flex max-w-[1600px] flex-wrap justify-between gap-4 text-black/60">
            <span>© {new Date().getFullYear()} Pulse OS</span>
            <span>React · Vite · Gemini · Supabase</span>
          </div>
        </footer>
      </main>
    </ReactLenis>
  );
}
