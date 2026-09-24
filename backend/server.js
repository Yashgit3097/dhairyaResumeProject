import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all incoming origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// CONNECT DB
connectDB();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder with open CORS headers
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(uploadsDir)
);

// API ROUTES
app.use('/api/auth', userRoutes);       // User authentication routes
app.use('/api/resume', resumeRoutes);   // Resume management routes
app.use('/api/upload', uploadRoutes);   // Standalone image uploads
app.use('/api/ai', aiRoutes);           // Gemini AI generative endpoints

app.get('/', (req, res) => {
  res.send('Welcome to Resume Builder API Server with Gemini AI!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});