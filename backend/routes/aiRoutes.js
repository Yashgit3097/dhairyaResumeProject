import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  generateSummary,
  enhanceBulletPoints,
  chatWithAssistant,
} from '../controllers/aiController.js';

const aiRouter = express.Router();

// Allow authenticated requests or optional auth for seamless UX
aiRouter.post('/generate-summary', protect, generateSummary);
aiRouter.post('/enhance-bullets', protect, enhanceBulletPoints);
aiRouter.post('/chat', protect, chatWithAssistant);

export default aiRouter;
