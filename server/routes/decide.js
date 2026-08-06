const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const TOKEN_PATH = path.join(__dirname, '../tokens.json');

// Initialize Gemini
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/evaluate', async (req, res) => {
  try {
    const { options, criteria } = req.body;
    
    if (!options || !criteria || !Array.isArray(options) || !Array.isArray(criteria)) {
      return res.status(400).json({ error: 'Options and criteria must be provided as arrays.' });
    }

    const prompt = `
      You are Pulse OS, an AI-powered enterprise operating system. 
      You are tasked with a "Strategic Decision" protocol. Evaluate the following Options based on the Criteria.
      
      Options:
      ${options.join('\n')}
      
      Criteria:
      ${criteria.join('\n')}
      
      Format your response strictly as JSON with this exact structure:
      {
        "primary_recommendation": {
          "title": "Short title of winning option",
          "match_percentage": 94,
          "justification": "Detailed explanation of why this was chosen."
        },
        "execution_plan": [
          { "app": "github", "description": "Create issue for tracking", "payload": { "owner": "your_github_username_or_org", "repo": "pulse-os", "title": "Implement X", "body": "Details..." } },
          { "app": "slack", "description": "Announce decision to team", "payload": { "channel": "#pulse-updates", "text": "We are proceeding with X..." } },
          { "app": "calendar", "description": "Schedule a review meeting", "payload": { "summary": "Review X implementation", "duration_minutes": 60 } }
        ],
        "risk_radar": {
          "capital": 80,
          "market": 40,
          "legal": 20,
          "operational": 60,
          "reputation": 30,
          "tech": 50
        },
        "alternatives": [
          {
            "title": "Alternative Option 1",
            "match_percentage": 62,
            "description": "Short description of alternative.",
            "est_cost": "$0M",
            "risk_level": "CRITICAL"
          }
        ]
      }
    `;

    const model = ai.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    try {
      const aiResponse = await model.generateContent(prompt);
      const text = aiResponse.response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/\{[\s\S]*\}/);
      const parsedData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;

      if (parsedData) {
        res.json({ success: true, ...parsedData });
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      throw err;
    }

  } catch (error) {
    console.error('Error in decide route:', error);
    res.status(500).json({ error: error.message || 'Failed to process decision' });
  }
});

// Autonomous Action Execution Route
router.post('/execute', async (req, res) => {
  try {
    const { execution_plan } = req.body;
    if (!execution_plan || !Array.isArray(execution_plan)) {
      return res.status(400).json({ error: 'execution_plan must be an array' });
    }

    let results = [];

    for (let action of execution_plan) {
      if (action.app === 'github') {
        if (!process.env.GITHUB_PAT) {
          results.push({ app: 'github', status: 'skipped', reason: 'No GITHUB_PAT configured' });
          continue;
        }
        try {
          const payload = action.payload;
          // Normally we'd POST to github, but since the repo might not exist, we just simulate or try to create it.
          // For prototype, we will just hit the github API, if it 404s, we return that.
          const resGh = await axios.post(`https://api.github.com/repos/${payload.owner}/${payload.repo}/issues`, {
            title: payload.title,
            body: payload.body
          }, {
            headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}`, Accept: 'application/vnd.github.v3+json' }
          });
          results.push({ app: 'github', status: 'success', data: resGh.data.html_url });
        } catch (e) {
          results.push({ app: 'github', status: 'error', reason: e.message });
        }
      }

      if (action.app === 'slack') {
        if (!process.env.SLACK_USER_TOKEN) {
          results.push({ app: 'slack', status: 'skipped', reason: 'No SLACK_USER_TOKEN configured' });
          continue;
        }
        try {
          const slack = new WebClient(process.env.SLACK_USER_TOKEN);
          await slack.chat.postMessage({
            channel: action.payload.channel || '#general',
            text: action.payload.text
          });
          results.push({ app: 'slack', status: 'success' });
        } catch (e) {
          results.push({ app: 'slack', status: 'error', reason: e.message });
        }
      }

      if (action.app === 'calendar') {
        if (!fs.existsSync(TOKEN_PATH)) {
          results.push({ app: 'calendar', status: 'skipped', reason: 'Google Calendar not authenticated' });
          continue;
        }
        try {
          const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
          );
          oauth2Client.setCredentials(tokens);
          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
          
          const start = new Date();
          start.setHours(start.getHours() + 1); // 1 hour from now
          const end = new Date(start.getTime() + (action.payload.duration_minutes || 60) * 60000);

          await calendar.events.insert({
            calendarId: 'primary',
            resource: {
              summary: action.payload.summary,
              start: { dateTime: start.toISOString() },
              end: { dateTime: end.toISOString() }
            }
          });
          results.push({ app: 'calendar', status: 'success' });
        } catch (e) {
          results.push({ app: 'calendar', status: 'error', reason: e.message });
        }
      }
    }

    res.json({ success: true, results });

  } catch (error) {
    console.error('Error executing actions:', error);
    res.status(500).json({ error: error.message || 'Failed to execute actions' });
  }
});

module.exports = router;
