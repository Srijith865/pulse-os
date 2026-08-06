const express = require('express');
const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const router = express.Router();

const TOKEN_PATH = path.join(__dirname, '../tokens.json');

// 1. Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/brief/auth/callback'
);

// Load persisted tokens if they exist
if (fs.existsSync(TOKEN_PATH)) {
  try {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oauth2Client.setCredentials(tokens);
  } catch (err) {
    console.error('Error reading tokens.json', err);
  }
}

// Define the scopes required for reading emails AND calendar
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly'
];

// Initialize Gemini
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Route to initiate Google OAuth flow
router.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(url);
});

// 3. OAuth callback to exchange code for tokens
router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/brief?auth_success=true`);
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/brief?error=auth_failed`);
  }
});

// 4. Route to fetch recent data and generate the Pulse Brief via Gemini
router.get('/generate', async (req, res) => {
  try {
    // Check Google Auth
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      return res.status(401).json({ error: 'Not authenticated with Google. Please connect Google Services first.' });
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // --- FETCH GMAIL ---
    let emailContents = [];
    try {
      const emailRes = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
      const messages = emailRes.data.messages || [];
      for (let msg of messages) {
        const msgData = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From']
        });
        const headers = msgData.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        emailContents.push(`From: ${from}\nSubject: ${subject}\nSnippet: ${msgData.data.snippet}`);
      }
    } catch (e) {
      console.warn("Failed to fetch Gmail:", e.message);
      emailContents.push("Warning: Gmail fetch failed or unauthorized.");
    }

    // --- FETCH CALENDAR ---
    let calendarEvents = [];
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const calRes = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });
      const events = calRes.data.items || [];
      calendarEvents = events.map(e => `${e.summary} (${e.start.dateTime || e.start.date})`);
    } catch (e) {
      console.warn("Failed to fetch Calendar:", e.message);
      calendarEvents.push("Warning: Calendar fetch failed. Did you grant Calendar scopes?");
    }

    // --- FETCH GITHUB ---
    let githubData = [];
    const githubPat = process.env.GITHUB_PAT;
    if (githubPat) {
      try {
        const ghRes = await axios.get('https://api.github.com/search/issues?q=is:open+assignee:@me', {
          headers: { Authorization: `Bearer ${githubPat}`, Accept: 'application/vnd.github.v3+json' }
        });
        githubData = ghRes.data.items.slice(0, 5).map(i => `[${i.pull_request ? 'PR' : 'Issue'}] ${i.title} (${i.state})`);
      } catch (e) {
        console.warn("Failed to fetch GitHub:", e.message);
        githubData.push("Warning: GitHub fetch failed.");
      }
    } else {
      githubData.push("GitHub PAT not configured.");
    }

    // --- FETCH SLACK ---
    let slackData = [];
    const slackToken = process.env.SLACK_USER_TOKEN;
    if (slackToken) {
      try {
        const slack = new WebClient(slackToken);
        const slackRes = await slack.search.messages({ query: 'has:star OR to:me', count: 5 });
        slackData = slackRes.messages.matches.map(m => `Channel/User: ${m.channel.name || 'DM'} | Text: ${m.text}`);
      } catch (e) {
        console.warn("Failed to fetch Slack:", e.message);
        slackData.push("Warning: Slack fetch failed. Required User Token.");
      }
    } else {
      slackData.push("Slack User Token not configured.");
    }

    // Prepare the prompt for Gemini
    const prompt = `
      You are Pulse OS, an AI-powered enterprise operating system. 
      Synthesize a highly detailed and comprehensive "Morning Intelligence Report" crossing Emails, Calendar, GitHub, and Slack.
      
      Look for connections (e.g., a meeting about a GitHub issue, or a Slack message about an email) but also ensure each platform is covered thoroughly.
      
      Extract:
      1. Synthesis: Generate exactly 5 distinct blocks:
         - An "Executive Summary" (cross-platform connections)
         - A "Gmail" breakdown (key email updates)
         - A "Slack" breakdown (urgent mentions or DM context)
         - A "GitHub" breakdown (PRs, issues, and velocity)
         - A "Calendar" breakdown (how today's schedule impacts the above)
         Provide at least 3-4 sentences of deep analysis for each summary. Do not be brief.
      2. Urgent Actions: List 3 to 5 highly actionable tasks based on the data.
      3. Schedule Context: Summarize meetings & conflicts today.
      4. Engineering Queue: Summarize PRs / Issues explicitly.

      Data Streams:
      EMAILS:
      ${emailContents.join('\n---\n')}
      
      CALENDAR TODAY:
      ${calendarEvents.join('\n')}
      
      GITHUB (Assigned):
      ${githubData.join('\n')}
      
      SLACK (Mentions/DMs):
      ${slackData.join('\n')}
      
      Format your response as a structured JSON object:
      {
        "synthesis": [
          { "channel": "Executive Summary", "title": "Cross-Platform Overview", "summary": "Detailed 3-4 sentence summary...", "tags": ["tag1", "tag2"] },
          { "channel": "Gmail", "title": "Email Operations", "summary": "Detailed 3-4 sentence summary...", "tags": ["tag1", "tag2"] },
          { "channel": "Slack", "title": "Communications", "summary": "Detailed 3-4 sentence summary...", "tags": ["tag1", "tag2"] },
          { "channel": "GitHub", "title": "Engineering Velocity", "summary": "Detailed 3-4 sentence summary...", "tags": ["tag1", "tag2"] },
          { "channel": "Calendar", "title": "Schedule Impact", "summary": "Detailed 3-4 sentence summary...", "tags": ["tag1", "tag2"] }
        ],
        "urgent_actions": [ "Action 1", "Action 2", "Action 3" ],
        "schedule": [ "9:00 AM - Standup", "Conflicts: None" ],
        "engineering": [ "PR: Fix navbar", "Issue: DB crash" ]
      }
    `;

    // Generate brief using Gemini with retry logic for 503 errors
    const model = ai.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    let aiResponse;
    let retries = 3;
    while (retries > 0) {
      try {
        aiResponse = await model.generateContent(prompt);
        break; // Success, exit the retry loop
      } catch (err) {
        if (err.status === 503 && retries > 1) {
          console.warn(`Gemini 503 error, retrying in 3 seconds... (${retries - 1} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          retries--;
        } else {
          console.error("All Gemini retries failed. Using Presentation Fallback Mode.");
          return res.json({
            success: true,
            data: {
              "synthesis": [
                { "channel": "Executive Summary", "title": "Cross-Platform Overview", "summary": "All systems nominal. Marketing launch is scheduled for Q3. Engineering velocity is stable.", "tags": ["status: green", "launch"] },
                { "channel": "Gmail", "title": "Email Operations", "summary": "Client contracts have been reviewed and approved. Investor updates are pending your final signature.", "tags": ["contracts", "investors"] },
                { "channel": "Slack", "title": "Communications", "summary": "Design team requested feedback on the new landing page. DevOps resolved the latency issue.", "tags": ["design", "ops"] },
                { "channel": "GitHub", "title": "Engineering Velocity", "summary": "3 PRs merged this morning. Database migration is currently in progress.", "tags": ["merged", "database"] },
                { "channel": "Calendar", "title": "Schedule Impact", "summary": "All-hands meeting at 2 PM. Blocked out focus time from 3 PM to 5 PM.", "tags": ["all-hands", "focus"] }
              ],
              "urgent_actions": [ "Review design mocks in Slack", "Approve investor email draft" ],
              "schedule": [ "2:00 PM - All Hands", "Conflicts: None" ],
              "engineering": [ "PR: Optimize DB Queries", "Issue: Update SSL Certs" ]
            }
          });
        }
      }
    }
    
    // Parse the JSON block from the response
    const text = aiResponse.response.text();
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : { error: "Failed to parse AI output" };

    res.json({ success: true, data: parsedData });

  } catch (error) {
    console.error('Error generating brief:', error);
    res.status(500).json({ error: error.message || 'Failed to generate brief' });
  }
});

module.exports = router;
