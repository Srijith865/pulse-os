require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const briefRoutes = require('./routes/brief');
const docsRoutes = require('./routes/docs');
const decideRoutes = require('./routes/decide');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/brief', briefRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/decide', decideRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'nominal', service: 'Pulse OS Core' });
});

app.listen(PORT, () => {
  console.log(`System Console Backend active on port ${PORT}`);
});
