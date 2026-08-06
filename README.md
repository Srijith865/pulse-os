# Pulse OS - System Intelligence Engine

![Pulse OS Demo Banner](https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1200)

Pulse OS is an AI-native digital workspace that replaces passive dashboards with an autonomous command center. Powered by Gemini 3.5 Flash, it ingests data across all your work tools, visualizes your global knowledge topology, and autonomously executes decisions on your behalf.

## 🚀 Key Features

*   **The Brief:** A synthesized daily intelligence report pulling directly from Google Workspace, Slack, and GitHub.
*   **Universal Media Processing (Pulse Docs):** Ingests PDFs, images, audio, and video files directly into a vector-backed Supabase knowledge graph using Google's generative File API.
*   **Autonomous Action Engine (Pulse Decide):** Recommends strategic decisions with a visual Risk Radar. When approved, Pulse OS physically creates GitHub issues, posts to Slack, and schedules Calendar events using authenticated APIs.
*   **Global Knowledge Graph:** Concurrently searches Supabase, Slack, and GitHub, drawing visual connecting nodes to synthesize cross-platform intelligence.

## 🛠️ Architecture

*   **Frontend:** React, Vite, Tailwind CSS (Custom Neo-Brutalist "Bento Grid" UI)
*   **Backend:** Node.js, Express
*   **Intelligence:** Google Gemini 3.5 Flash (Text + File API)
*   **Memory:** Supabase (PostgreSQL)
*   **Integrations:** Google Calendar, GitHub REST, Slack Web API

## 🚦 Local Setup

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/your-username/pulse-os.git
cd pulse-os

# Install Client Dependencies
cd client
npm install

# Install Server Dependencies
cd ../server
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env\` file in the `server` directory and add your API keys:
\`\`\`env
# Gemini
GEMINI_API_KEY=your_gemini_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/brief/oauth2callback

# GitHub
GITHUB_PAT=your_github_personal_access_token

# Slack
SLACK_USER_TOKEN=your_slack_user_token

# Client URL (For CORS & OAuth)
CLIENT_URL=http://localhost:5173
\`\`\`

Create a \`.env\` file in the `client` directory:
\`\`\`env
VITE_API_URL=http://localhost:3000
\`\`\`

### 3. Run the OS
Start the Backend:
\`\`\`bash
cd server
npm run dev
\`\`\`

Start the Frontend:
\`\`\`bash
cd client
npm run dev
\`\`\`

## 🌐 Deployment (Production)

### Frontend (Vercel)
1. Push this repository to GitHub.
2. Connect the repository in Vercel.
3. Set the Root Directory to `client`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.

### Backend (Render)
1. Connect the repository in Render (Web Service).
2. Set the Root Directory to `server`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `node index.js`.
5. Add all the `.env` variables from your local setup in the Render dashboard. Make sure to update `CLIENT_URL` and `GOOGLE_REDIRECT_URI` to use your Vercel URL and Render URL respectively!
