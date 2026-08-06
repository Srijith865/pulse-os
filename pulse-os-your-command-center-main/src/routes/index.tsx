import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Pulse OS — Your Operating System for Work";
const DESC =
  "Pulse OS unifies your email, calendar, code, and communications into a single AI-powered command center. Make decisions faster. See everything. Miss nothing.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

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

const STEPS = [
  { n: "01", t: "Connect", b: "Link Gmail, Calendar, GitHub and Slack in one click." },
  { n: "02", t: "Analyze", b: "Gemini processes your data streams in real time, extracting patterns and priorities." },
  { n: "03", t: "Act", b: "Receive briefs, verdicts and graphs. Make confident decisions." },
];

const ADVANTAGES = [
  ["Real-Time AI", "Gemini flash-lite streams synthesis as your data changes."],
  ["Secure Auth", "Supabase email auth. No data parked on third-party servers."],
  ["Cloud Native", "Vercel edge frontend, Render backend, Postgres core."],
  ["Multi-Platform", "Gmail, Calendar, GitHub REST, Slack on the way."],
];

function Marquee() {
  const items = ["Stop switching tabs", "AI that thinks for you", "Inbox to insight in seconds", "See how everything connects"];
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-ink py-4 text-ink-foreground">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="label-mono flex items-center gap-8">
            {t}
            <span className="text-accent">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5">
          <span className="label-mono font-medium">Pulse OS ®</span>
          <nav className="label-mono hidden gap-8 text-muted-foreground md:flex">
            <a href="#modules" className="hover:text-foreground">Modules</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#edge" className="hover:text-foreground">Advantages</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#cta" className="label-mono rounded-full px-4 py-2 hover:bg-secondary">Login</a>
            <a
              href="#cta"
              className="label-mono rounded-full bg-ink px-4 py-2 text-ink-foreground transition-transform active:scale-[0.97]"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col justify-between px-5 pt-28 pb-6">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="rise grid gap-6 border-b border-border pb-8 md:grid-cols-12">
            <p className="label-mono text-muted-foreground md:col-span-4">
              [ AI operating system for work ]
            </p>
            <p className="max-w-md text-lg leading-snug text-muted-foreground md:col-span-5 md:col-start-8">
              Pulse OS unifies your email, calendar, code and communications into a single
              command center. Make decisions faster. See everything. Miss nothing.
            </p>
          </div>

          <h1 className="display-xl mt-10 text-[17vw] leading-[0.82] md:text-[13.2vw]">
            Your operating
            <br />
            system <span className="text-muted-foreground">for</span> work
          </h1>
        </div>

        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            <a
              href="#cta"
              className="label-mono rounded-full bg-ink px-6 py-3.5 text-ink-foreground transition-transform active:scale-[0.97]"
            >
              Enter Pulse OS →
            </a>
            <a
              href="#modules"
              className="label-mono rounded-full border border-border px-6 py-3.5 transition-colors hover:bg-secondary"
            >
              See the modules
            </a>
          </div>
          <span className="label-mono text-muted-foreground">Scroll ↓</span>
        </div>
      </section>

      <Marquee />

      {/* MODULES */}
      <section id="modules" className="mx-auto max-w-[1600px] px-5 py-24">
        <div className="grid gap-4 md:grid-cols-12">
          <p className="label-mono text-muted-foreground md:col-span-4">[ Four modules ]</p>
          <h2 className="display-xl text-[9vw] leading-[0.88] md:col-span-8 md:text-[5.4vw]">
            One screen instead of five apps
          </h2>
        </div>

        <div className="mt-16 border-t border-border">
          {MODULES.map((m) => (
            <article
              key={m.n}
              className="group grid gap-4 border-b border-border py-10 transition-colors hover:bg-card md:grid-cols-12 md:items-baseline"
            >
              <span className="label-mono text-muted-foreground md:col-span-1">{m.n}</span>
              <h3 className="display-xl text-5xl md:col-span-4 md:text-6xl">{m.name}</h3>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:col-span-5">
                {m.body}
              </p>
              <span className="label-mono justify-self-start rounded-full border border-border px-3 py-1.5 md:col-span-2 md:justify-self-end">
                {m.tag}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-24">
          <p className="label-mono opacity-60">[ How it works ]</p>
          <h2 className="display-xl mt-4 text-[10vw] leading-[0.88] md:text-[6vw]">
            Connect. Analyze. Act.
          </h2>
          <div className="mt-16 grid gap-px md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t border-ink-foreground/20 pt-6 pr-8">
                <span className="label-mono text-accent">{s.n}</span>
                <h3 className="mt-6 text-3xl font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-3 max-w-xs leading-relaxed opacity-60">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="edge" className="mx-auto max-w-[1600px] px-5 py-24">
        <div className="grid gap-4 md:grid-cols-12">
          <p className="label-mono text-muted-foreground md:col-span-4">[ Advantages ]</p>
          <h2 className="display-xl text-[9vw] leading-[0.88] md:col-span-8 md:text-[5.4vw]">
            Built for teams of two to twenty
          </h2>
        </div>
        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map(([t, b]) => (
            <div key={t} className="bg-background p-8">
              <h3 className="text-xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="border-t border-border px-5 py-28">
        <div className="mx-auto max-w-[1600px] text-center">
          <h2 className="display-xl text-[13vw] leading-[0.86] md:text-[9vw]">
            Enter Pulse OS
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted-foreground">
            Decisions without emotion. Intelligence without tab-switching.
          </p>
          <a
            href="#cta"
            className="label-mono mt-10 inline-block rounded-full bg-ink px-8 py-4 text-ink-foreground transition-transform active:scale-[0.97]"
          >
            Get started — it's free
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8">
        <div className="label-mono mx-auto flex max-w-[1600px] flex-wrap justify-between gap-4 text-muted-foreground">
          <span>© {new Date().getFullYear()} Pulse OS</span>
          <span>React · Vite · Gemini · Supabase</span>
        </div>
      </footer>
    </main>
  );
}
