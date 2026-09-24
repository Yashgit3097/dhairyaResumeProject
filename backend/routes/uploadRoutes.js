import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const uploadRouter = express.Router();

// Route for standalone image upload (e.g. profile picture or custom image assets)
uploadRouter.post('/image', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const imageUrl = `${baseUrl}${req.file.filename}`;

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  });
});

export default uploadRouter;
