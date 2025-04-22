import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ videoId, onPlayerReady, playerRef, onTimeUpdate }) => {
  const intervalRef = useRef(null);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  const handlePlayerReady = (event) => {
    console.log("Player is ready");
    if (onPlayerReady) onPlayerReady(event);
    if (playerRef) {
      playerRef.current = event.target;
      console.log("Player reference set:", playerRef.current);
    }
  };

  const handleStateChange = (event) => {


    if (event.data === window.YT.PlayerState.PLAYING) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (playerRef?.current) {
            const time = playerRef.current.getCurrentTime();

            onTimeUpdate(time);
          }
        }, 1000);
      }
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="my-4">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handlePlayerReady}
        onStateChange={handleStateChange}
      />
    </div>
  );
};

export default YouTubePlayer;
