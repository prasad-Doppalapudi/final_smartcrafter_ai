// DetachAudioPage.js
import React, { useState } from 'react';
import './DetachAudioPage.css'; // Ensure the correct filename case

const DetachAudioPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');

  const handleVideoUpload = event => {
    const file = event.target.files[0];
    setSelectedVideo(file);
  };

  const detachAudio = async () => {
    if (!selectedVideo) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('videoFile', selectedVideo);

    try {
      const response = await fetch('http://127.0.0.1:5000/detach_audio', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Add this line to include credentials with requests
      });

      if (!response.ok) {
        throw new Error('Failed to detach audio from video');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
      alert('Audio detached and available for download.');
    } catch (error) {
      console.error('Error detaching audio from video:', error.message);
    }
  };

  return (
    <div className="detach-audio-from-video">
      <h2>Detach Audio From Video</h2>
      <div className="upload-section">
        <label htmlFor="videoFile">Upload the video file:</label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={handleVideoUpload}
        />
        <button onClick={detachAudio}>Detach Audio</button>
      </div>
      {audioUrl && (
        <div>
          <h3>Extracted Audio:</h3>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default DetachAudioPage;
