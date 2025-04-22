import React, { useEffect, useRef } from "react";

const SavedNotes = ({ notes, playerRef }) => {
  const containerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const container = containerRef.current;
  
    const handleClick = (e) => {
      const target = e.target.closest(".timestamp");
      if (target) {
        const time = parseFloat(target.dataset.time);
        if (!isNaN(time) && playerRef?.current?.seekTo) {
          playerRef.current.seekTo(time, true);
        } else {
          console.warn("Could not seek — player or timestamp invalid.");
        }
      }
    };
  
    if (container) {
      container.addEventListener("click", handleClick);
    }
  
    return () => {
      if (container) {
        container.removeEventListener("click", handleClick);
      }
    };
  }, [playerRef, notes]);
  

  return (
    <div className="mt-6" ref={containerRef}>
      <h2 className="text-lg font-semibold mb-2">📝 Saved Notes</h2>
      {notes.map((note, index) => (
        <div key={index} className="border p-2 my-2 rounded shadow">
          <div className="text-sm text-gray-600 mb-1">
            Timestamp:
            <button
              className="timestamp text-blue-500 ml-2 underline"
              data-time={note.timestamp}
            >
              [{formatTime(note.timestamp)}]
            </button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      ))}
    </div>
  );
};

export default SavedNotes;
