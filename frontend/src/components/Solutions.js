import React from 'react';
import { Link } from 'react-router-dom';
import './Solutions.css'; // Import the component-specific styles

const Solutions = () => {
  return (
    <div className="solutions">
      <h2>Solutions</h2>
      <div className="solution-list">
        <div className="solution">
          <h3>Text-To-Speech</h3>
          <p>Convert text to speech with ease.</p>
          <Link to="/solutions/text-to-speech">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Speech-To-Text</h3>
          <p>Transcribe speech into written text.</p>
          <Link to="/solutions/speech-to-text">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Content Creator</h3>
          <p>Create SEO-friendly content on any topic.</p>
          <Link to="/solutions/generate-content">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Detach Audio-Video</h3>
          <p>Extract Audio from Video.</p>
          <Link to="/solutions/detach-audio">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Generate Image</h3>
          <p>Generate an Image with your text description.</p>
          <Link to="/solutions/generate-image">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Generate Logo</h3>
          <p>Generate logo for your business.</p>
          <Link to="/solutions/generate-logo">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Shorts Language Converter</h3>
          <p>Convert 1-minute video language to a different language.</p>
          <Link to="/solutions/shorts-language-converter">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Generate Video</h3>
          <p>Generate video.</p>
          <Link to="/solutions/generate-video">Click Here for More Details</Link>
        </div>
        <div className="solution">
          <h3>Edit Image</h3>
          <p>Edit the Image.</p>
          <Link to="/solutions/image-variant">Click Here for More Details</Link>
        </div>
      </div>
    </div>
  );
};

export default Solutions;