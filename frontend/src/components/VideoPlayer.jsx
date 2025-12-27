// frontend/src/components/VideoPlayer.jsx
// YouTube video player component

import React from 'react';

const VideoPlayer = ({ videoId, title = 'Course Video' }) => {
  if (!videoId) {
    return (
      <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No video available</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;