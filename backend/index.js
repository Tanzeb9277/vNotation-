const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();

// Set up PostgreSQL client for Docker environment
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'notesdb',
  password: 'postgres',
  port: 5432,
});

app.use(express.json());  // Middleware to parse JSON bodies

// Helper function to extract YouTube ID from URL
const extractYouTubeId = (url) => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// POST /api/videos - Create a new video
app.post('/api/videos', async (req, res) => {
  const { youtubeUrl } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ message: 'YouTube URL is required.' });
  }

  const youtubeId = extractYouTubeId(youtubeUrl);

  if (!youtubeId) {
    return res.status(400).json({ message: 'Invalid YouTube URL.' });
  }

  try {
    // Fetch video details from YouTube API
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet',
        id: youtubeId,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: 'Video not found on YouTube.' });
    }

    const videoDetails = response.data.items[0].snippet;
    const videoTitle = videoDetails.title;
    const thumbnailUrl = videoDetails.thumbnails?.default?.url;

    // Save the video in the database
    const result = await pool.query(
      'INSERT INTO videos (youtube_id, title, thumbnail_url) VALUES ($1, $2, $3) RETURNING *',
      [youtubeId, videoTitle, thumbnailUrl]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving video:', error);
    if (error.response?.status === 403) {
      return res.status(500).json({ message: 'YouTube API key is invalid or quota exceeded.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Set up the server to listen on a port
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
