import React, { useState, useRef } from "react";
import YouTubePlayer from "./components/YouTubePlayer";
import NoteEditor from "./components/NoteEditor";
import SavedNotes from "./components/SavedNotes";

function App() {
  const [videoId, setVideoId] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [savedNotes, setSavedNotes] = useState([]);

  const playerRef = useRef(null);

  const extractYouTubeId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractYouTubeId(inputUrl);
    if (id) setVideoId(id);
  };

  const handlePlayerReady = (event) => {
    console.log("Player ready in App");
    playerRef.current = event.target;
    // Initial time update
    setCurrentTime(event.target.getCurrentTime());
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleSaveNote = (note) => {
    const newNote = {
      ...note,
      timestamp: currentTime,
      videoId
    };
    console.log("Saving note:", newNote);
    setSavedNotes((prev) => [...prev, newNote]);
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎥 vNotation - Code Sync Test!</h1>
      <p className="text-gray-600 mb-4">Testing real-time code updates...</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          className="border px-2 py-1 mr-2"
          placeholder="Paste YouTube URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">
          Load Video
        </button>
      </form>

      {videoId && (
        <>
          <YouTubePlayer 
            videoId={videoId} 
            playerRef={playerRef}
            onPlayerReady={handlePlayerReady}
            onTimeUpdate={handleTimeUpdate}
          />
          <NoteEditor
            onSave={handleSaveNote}
            currentTime={currentTime}
            playerRef={playerRef}
            videoId={videoId} 
          />
          <SavedNotes 
            notes={savedNotes} 
            playerRef={playerRef}
          />
          
        </>
      )}
    </div>
  );
}

export default App;
