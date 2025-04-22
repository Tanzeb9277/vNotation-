const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/videos/:videoId/notes - Get all notes for a video
router.get('/:videoId/notes', async (req, res) => {
  const { videoId } = req.params;

  try {
    // First check if the video exists
    const videoResult = await pool.query(
      'SELECT id FROM videos WHERE id = $1',
      [videoId]
    );

    if (videoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    // Get all notes for the video, ordered by timestamp
    const notesResult = await pool.query(
      'SELECT * FROM notes WHERE video_id = $1 ORDER BY timestamp ASC',
      [videoId]
    );

    return res.json(notesResult.rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/videos/:videoId/notes - Create a new note for a video
router.post('/:videoId/notes', async (req, res) => {
  const { videoId } = req.params;
  const { content, timestamp } = req.body;

  // Validate request body
  if (!content) {
    return res.status(400).json({ message: 'Note content is required.' });
  }

  if (typeof timestamp !== 'number' || timestamp < 0) {
    return res.status(400).json({ message: 'Valid timestamp is required.' });
  }

  try {
    // First check if the video exists
    const videoResult = await pool.query(
      'SELECT id FROM videos WHERE id = $1',
      [videoId]
    );

    if (videoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    // Create the note
    const result = await pool.query(
      'INSERT INTO notes (video_id, content, timestamp) VALUES ($1, $2, $3) RETURNING *',
      [videoId, content, timestamp]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating note:', error);
    // Check for unique constraint violation
    if (error.code === '23505') {
      return res.status(400).json({ 
        message: 'A note already exists at this timestamp for this video. PLease edit the existing note instead' 
      });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 