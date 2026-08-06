# Pulse OS: Your Command Center

I wanna create a Hero page for this application : # Pulse OS — Complete Application Context

Use this document as a prompt/context for any AI design tool (Lovable, Bolt, v0, Figma AI, etc.) to generate a hero/landing page for Pulse OS.

---

## What is Pulse OS?

**Pulse OS** is an AI-powered operating system for work. It unifies a user's email, calendar, code repositories, and team communications into a single real-time intelligence dashboard. Instead of switching between Gmail, Slack, GitHub, and Google Calendar, Pulse OS pulls data from all of them and uses Google's Gemini AI to generate actionable insights, strategic decisions, and visual knowledge graphs — all in one place.

**Tagline:** *"Your Operating System for Work"*

**One-liner:** *Pulse OS unifies your email, calendar, code, and communications into a single AI-powered command center. Make decisions faster. See everything. Miss nothing.*

---

## Core Features (4 Modules)

### 1. Brief (Morning Intelligence Briefing)

- Connects to **Gmail**, **Google Calendar**, **Slack**, and **GitHub** via OAuth and API tokens.

- Uses **Google Gemini AI** to synthesize all incoming data into a single, prioritized executive briefing.

- Outputs: cross-platform synthesis cards, urgent actions, schedule conflicts, and engineering velocity (open PRs, merged PRs, issues).

- **Icon:** `wb_sunny` (sun) · **Tag:** INTELLIGENCE

### 2. Decide (Strategic Decision Engine)

- User inputs **Current Parameters** (constraints, budget, resources) and a **Proposed Initiative** (what they want to do).

- Gemini AI acts as a cold, emotionless strategist and returns a structured verdict:

  - **Decision:** PROCEED / REVISE / ABORT

  - **Confidence Score:** e.g., 78%

  - **Risk Factors:** listed out

  - **Next Steps:** actionable recommendations

- **Icon:** `query_stats` · **Tag:** STRATEGY

### 3. Search (Deep Topology Search / Knowledge Graph)

- User types a complex question or topic (e.g., "Map the dependencies for our Q3 marketing launch").

- Gemini generates **Nodes** (concepts) and **Edges** (relationships) as structured JSON.

- The UI renders an interactive, visual **knowledge graph** — a web of connected boxes and lines showing how ideas relate.

- **Icon:** `hub` · **Tag:** TOPOLOGY

### 4. Docs (Document Intelligence Engine)

- User uploads any media file (PDF, image, audio, video).

- Gemini analyzes the media and extracts:

  - **Executive Summary:** 2-3 sentence overview

  - **Strategic Suggestions:** 3 actionable next steps

  - **Structured Entities:** Concepts, Constraints, Parameters, Criticals with confidence scores

- Also renders a **Knowledge Topology** visualization of the extracted entities.

- **Icon:** `description` · **Tag:** ANALYSIS

---

## Tech Stack

| Layer | Technology |

|-------|-----------|

| Frontend | React, Vite, Tailwind CSS |

| Backend | Node.js, Express |

| AI Engine | Google Gemini (gemini-flash-lite-latest) |

| Database | Supabase (PostgreSQL + Auth) |

| Auth | Supabase Email/Password (no email verification) |

| Hosting | Vercel (frontend), Render (backend) |

| Integrations | Gmail API, Google Calendar API, GitHub REST API, Slack (future) |

---

## Visual Design Language

### Current Aesthetic: Glassmorphism + Editorial Hybrid

- **Background:** Light off-white (`#f8f8fc`) with subtle dot-grid pattern

- **Surfaces:** Frosted glass cards (`backdrop-filter: blur(16px)`, semi-transparent white, soft shadows)

- **Accent Color:** Indigo-to-purple gradient (`#6366f1` → `#8b5cf6` → `#a78bfa`)

- **Typography:**

  - Headlines: **Hanken Grotesk** (bold, tight tracking)

  - Body: **Inter** (clean, readable)

  - Labels/Tags: **JetBrains Mono** (monospace, uppercase, wide tracking)

- **Icons:** Google Material Symbols Outlined

- **Borders:** Subtle (`rgba(0,0,0,0.08)`) instead of harsh black

- **Corners:** Rounded (`rounded-xl`, `rounded-2xl`, `rounded-3xl`)

- **Effects:** Floating ambient gradient blobs behind content, hover-lift on cards, button press feedback (`scale(0.97)`)

- **Animations:** Scroll-reveal with `IntersectionObserver`, stagger delays (60-80ms), strong ease-out curve (`cubic-bezier(0.23, 1, 0.32, 1)`)

### Color Palette (Tailwind tokens)

```

primary:           #000000

on-primary:        #ffffff

background:        #fbf8ff (body override: #f8f8fc)

surface:           #fbf8ff

secondary:         #5d5f5f

on-surface-variant: #4c4546

error:             #ba1a1a

accent-gradient:   linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)

```

---

## Target Audience

- **Startup founders** who juggle multiple tools daily

- **Product managers** who need cross-platform visibility

- **Engineering leads** tracking PRs, issues, and team velocity

- **Small teams** (2-20 people) who want an AI-powered command center instead of checking 5 different apps

---

## Key Selling Points (for Hero Page Copy)

1. **"Stop switching tabs."** — Pulse OS brings Gmail, Calendar, GitHub, and Slack into one screen.

2. **"AI that thinks for you."** — Gemini AI doesn't just summarize — it recommends, decides, and maps relationships.

3. **"From inbox to insight in seconds."** — Upload a document, get a summary and action items instantly.

4. **"Decisions without emotion."** — The Decide engine gives you a mathematical verdict, not a gut feeling.

5. **"See how everything connects."** — The Search engine draws a live knowledge graph of any topic.

6. **"Secure by default."** — Supabase authentication, no data stored on third-party servers.

---

## User Flow

```

Landing Page → Login/Register → Dashboard (/app/brief)

                                    ├── Brief   (AI morning briefing)

                                    ├── Docs    (Upload & analyze media)

                                    ├── Decide  (AI strategic decisions)

                                    └── Search  (Knowledge graph generation)

```

---

## How It Works (3 Steps)

1. **Connect** — Link your Gmail, Calendar, GitHub, and Slack accounts in one click.

2. **Analyze** — Gemini AI processes your data streams in real time, extracting patterns and priorities.

3. **Act** — Receive actionable briefs, strategic verdicts, and knowledge graphs. Make confident decisions.

---

## Suggested Hero Page Structure

1. **Sticky Nav** — Logo + Login/Get Started buttons

2. **Hero Section** — Large headline, tagline, CTA buttons, scroll indicator

3. **Features Grid** — 4 cards (Brief, Decide, Search, Docs) with icons and descriptions

4. **How It Works** — 3-step flow (Connect → Analyze → Act)

5. **Advantages** — Real-Time AI, Secure Auth, Cloud Native, Multi-Platform

6. **CTA Section** — Final call to action with "Enter Pulse OS" button

7. **Footer** — Copyright, tech stack credits

---



I want this Hero page to look like lenis.dev website , just copy from lenis.dev

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/92cb6491-17e8-403e-92f1-be5a9e395317).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
