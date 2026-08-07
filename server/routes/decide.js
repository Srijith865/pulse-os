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
    const { context } = req.body;
    
    if (!context || typeof context !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid decision context.' });
    }

    const prompt = `
      You are Pulse OS, an AI-powered enterprise operating system. 
      You are tasked with a "Strategic Decision" protocol. Evaluate the following context and propose a decision.
      
      Context:
      ${context}
      
      Format your response strictly as JSON with this exact structure:
      {
        "primary_recommendation": {
          "title": "Short title of winning option",
          "match_percentage": 94,
          "justification": "Detailed explanation of why this was chosen."
        },
        "execution_plan": [
          { "app": "github", "description": "Edit code in GitHub repository", "payload": { "owner": "Srijith865", "repo": "nocturne1", "path": "pulse-action-log.md", "message": "Update via Action Engine", "content": "Applied new strategic decision." } },
          { "app": "slack", "description": "Notify team about code edit", "payload": { "channel": "#general", "text": "I have successfully edited the code in GitHub based on the strategic decision." } },
          { "app": "calendar", "description": "Schedule a review meeting", "payload": { "summary": "Review updated code implementation", "duration_minutes": 60 } }
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
    let aiResponse;
    let retries = 3;
    while (retries > 0) {
      try {
        aiResponse = await model.generateContent(prompt);
        break;
      } catch (err) {
        if (err.status === 503 && retries > 1) {
          console.warn(`Gemini 503 error in decide route, retrying in 3 seconds... (${retries - 1} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          retries--;
        } else {
          throw err;
        }
      }
    }
    
    try {
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
          let sha;
          try {
            // Attempt to fetch the file to get its current SHA (needed for updates)
            const fileRes = await axios.get(`https://api.github.com/repos/${payload.owner}/${payload.repo}/contents/${payload.path}`, {
              headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}`, Accept: 'application/vnd.github.v3+json' }
            });
            sha = fileRes.data.sha;
          } catch (getFileErr) {
            // File might not exist (404), which is fine for new files.
          }
          
          const contentBase64 = Buffer.from(payload.content || '').toString('base64');
          
          const resGh = await axios.put(`https://api.github.com/repos/${payload.owner}/${payload.repo}/contents/${payload.path}`, {
            message: payload.message || 'Automated code edit via Pulse OS',
            content: contentBase64,
            sha: sha
          }, {
            headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}`, Accept: 'application/vnd.github.v3+json' }
          });
          results.push({ app: 'github', status: 'success', data: resGh.data.content.html_url });
        } catch (e) {
          results.push({ app: 'github', status: 'error', reason: e.response?.data?.message || e.message });
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
