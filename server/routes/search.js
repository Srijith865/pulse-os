const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/query', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    console.log(`Knowledge Graph Search for: ${q}`);

    // --- FETCH SUPABASE DOCS ---
    let docsData = [];
    try {
      // Just fetch all docs and let AI filter for prototype
      const { data, error } = await supabase.from('documents').select('*').limit(10);
      if (!error && data) {
        docsData = data.map(d => `Doc ID: ${d.id}, Name: ${d.file_name}, Content: ${JSON.stringify(d.entities).substring(0, 500)}`);
      }
    } catch (e) {
      console.warn("Docs search failed:", e.message);
    }

    // --- FETCH GITHUB ---
    let githubData = [];
    if (process.env.GITHUB_PAT) {
      try {
        const ghRes = await axios.get(`https://api.github.com/search/issues?q=${encodeURIComponent(q + ' assignee:@me')}`, {
          headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}`, Accept: 'application/vnd.github.v3+json' }
        });
        githubData = ghRes.data.items.slice(0, 5).map(i => `GH-${i.id}: [${i.pull_request ? 'PR' : 'Issue'}] ${i.title} - ${i.state}`);
      } catch (e) {
        console.warn("GitHub search failed:", e.message);
      }
    }

    // --- FETCH SLACK ---
    let slackData = [];
    if (process.env.SLACK_USER_TOKEN) {
      try {
        const slack = new WebClient(process.env.SLACK_USER_TOKEN);
        const slackRes = await slack.search.messages({ query: q, count: 5 });
        slackData = slackRes.messages.matches.map(m => `Slack-${m.ts}: Channel ${m.channel.name} | Text: ${m.text}`);
      } catch (e) {
        console.warn("Slack search failed:", e.message);
      }
    }

    const prompt = `
      You are Pulse OS, an AI-powered enterprise operating system.
      The user has searched for: "${q}"
      
      I have gathered raw data from their Documents (PDFs/Media), GitHub, and Slack.
      Your task is to synthesize this into a "Knowledge Graph" that connects the dots across platforms.
      
      Data:
      DOCS:
      ${docsData.join('\n')}
      
      GITHUB:
      ${githubData.join('\n')}
      
      SLACK:
      ${slackData.join('\n')}
      
      Format your response strictly as JSON with this exact structure:
      {
        "narrative_summary": "A 2-paragraph cohesive narrative explaining how these items connect.",
        "nodes": [
          { "id": "unique-id", "label": "Short Title", "type": "document|github|slack", "details": "Snippet of info" }
        ],
        "edges": [
          { "source": "unique-id-1", "target": "unique-id-2", "relationship": "references / blocks / discusses" }
        ]
      }
      
      Make sure edges use valid node IDs.
    `;

    const model = ai.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const aiResponse = await model.generateContent(prompt);
    
    const text = aiResponse.response.text();
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;

    if (!parsedData) {
      throw new Error("Failed to parse Gemini output into JSON.");
    }

    res.json({ success: true, data: parsedData });

  } catch (error) {
    console.error('Error generating knowledge graph:', error);
    res.status(500).json({ error: error.message || 'Failed to generate graph' });
  }
});

module.exports = router;
