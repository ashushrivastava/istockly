// backend/routes/upload.js
// File upload routes with Cloudinary integration

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Upload image (admin only)
router.post('/image', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lms-courses',
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ 
            error: 'Upload failed',
            message: error.message 
          });
        }

        res.json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    // Pipe the buffer to Cloudinary
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
});

// Delete image (admin only)
router.delete('/image/:publicId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const publicId = req.params.publicId.replace(/___/g, '/');
    await cloudinary.uploader.destroy(publicId);
    
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;