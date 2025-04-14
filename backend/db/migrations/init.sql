-- db/migrations/init.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS videos;

-- Create tables
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  youtube_id VARCHAR(20) UNIQUE NOT NULL,
  title TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  timestamp INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_video_timestamp UNIQUE(video_id, timestamp)
);
