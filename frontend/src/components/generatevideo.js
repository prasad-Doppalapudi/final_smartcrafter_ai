import React, { useState } from 'react';
import './generatevideo.css';

const GenerateVideo = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [accent, setAccent] = useState('default');
  const [voice, setVoice] = useState('default');
  const [videoSize, setVideoSize] = useState('720p');
  const [videoUrl, setVideoUrl] = useState('');

  const handleGenerateVideo = async () => {
    const requestData = {
      prompt,
      language,
      accent,
      voice,
      video_size: videoSize,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/generate_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="generate-video">
      <h1>Generate Video</h1>
      <div>
        <label htmlFor="prompt">Prompt:</label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          {/* Add more languages as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="accent">Accent:</label>
        <select
          id="accent"
          value={accent}
          onChange={e => setAccent(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="us">American</option>
          <option value="uk">British</option>
          <option value="au">Australian</option>
          <option value="in">Indian</option>
          {/* Add more accents as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="voice">Voice:</label>
        <select
          id="voice"
          value={voice}
          onChange={e => setVoice(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          {/* Add more voice options as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="videoSize">Video Size:</label>
        <select
          id="videoSize"
          value={videoSize}
          onChange={e => setVideoSize(e.target.value)}
        >
          <option value="1080p">YouTube Video (1080p)</option>
          <option value="720p">YouTube Video (720p)</option>
          <option value="reel">Reel (1080x1920)</option>
        </select>
      </div>
      <button onClick={handleGenerateVideo}>Generate Video</button>
      {videoUrl && (
        <video controls src={videoUrl} style={{ width: '100%' }}>
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default GenerateVideo;
