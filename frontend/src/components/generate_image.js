import React, { useState } from 'react';
import axios from 'axios';
import './generate_image.css';

function GenerateImage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_image', { prompt, style });
      setImageURL(response.data.image_url);
    } catch (error) {
      setError('Error generating image. Please try again.');
      console.error('Error:', error);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/download_image', { image_url: imageURL }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated_image.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  return (
    <div className="container">
      <h2>Generate Image</h2>
      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="input-container">
            <label htmlFor="promptInput">Prompt:</label>
            <input
              id="promptInput"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
            />
          </div>
          <div className="input-container">
            <label htmlFor="styleSelect">Style:</label>
            <select
              id="styleSelect"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="">Select Style</option>
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="abstract">Abstract</option>
              <option value="sketch">Sketch</option>
            </select>
          </div>
          <button type="submit">Generate</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        {imageURL && (
          <div className="generated-image">
            <h3>Generated Image</h3>
            <img src={imageURL} alt="Generated" width="256" height="256" />
            <button className="download-button" onClick={downloadImage}>Download Image</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateImage;