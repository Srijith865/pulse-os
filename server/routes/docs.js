const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize Gemini
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Gemini File Manager
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// Setup Multer for disk uploads to handle large media
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

// Get all documents
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching docs:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Upload and analyze Media
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname;

    console.log(`Uploading ${originalName} to Gemini...`);
    
    // Upload the file to Gemini
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: mimeType,
      displayName: originalName,
    });

    const fileUri = uploadResponse.file.uri;
    
    const prompt = `
      You are Pulse OS. Analyze the attached media (which could be a document, image, audio, or video) and extract structured entities.
      Extract Concepts, Constraints, Parameters, and Criticals.
      
      Format as JSON:
      {
        "entities": [
          { "type": "Concept", "value": "Extracted text", "confidence": "99.8%" }
        ]
      }
    `;

    // We use gemini-3.5-flash since it's the model available for this key
    const model = ai.getGenerativeModel({ model: "gemini-3.6-flash" });
    const aiResponse = await model.generateContent([
      prompt,
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: fileUri
        }
      }
    ]);

    const text = aiResponse.response.text();
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : { entities: [] };

    // Clean up temporary file
    fs.unlinkSync(filePath);

    // Save to Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert([{ 
        file_name: originalName,
        entities: parsedData
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, document: data });

  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ error: error.message || 'Failed to process document' });
  }
});

module.exports = router;
