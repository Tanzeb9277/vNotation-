# vNotation

A video note-taking application that allows users to save and annotate YouTube videos.

## Features

- Save YouTube videos with their metadata
- Add timestamped notes to videos
- View video thumbnails and titles

## Prerequisites

- Docker and Docker Compose
- YouTube API key

## Setup

1. Clone the repository
2. Copy the environment template:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Edit `backend/.env` and add your YouTube API key
4. Start the containers:
   ```bash
   docker-compose up -d --build
   ```

## API Endpoints

### POST /api/videos
Add a new video to the database.

Request body:
```json
{
    "youtubeUrl": "https://www.youtube.com/watch?v=your-video-id"
}
```

## Database Schema

### Videos Table
- `id`: Primary key
- `youtube_id`: Unique YouTube video ID
- `title`: Video title
- `thumbnail_url`: Video thumbnail URL
- `created_at`: Timestamp of creation

### Notes Table
- `id`: Primary key
- `video_id`: Foreign key to videos table
- `content`: JSON content of the note
- `timestamp`: Video timestamp for the note
- `created_at`: Timestamp of creation 