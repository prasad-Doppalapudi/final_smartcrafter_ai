import React, { useState } from 'react';
import axios from 'axios';
import './generate_logo.css';

function GenerateLogo() {
  const [formData, setFormData] = useState({
    businessName: '',
    tagline: '',
    industry: 'Technology',
    colorScheme: 'Red',
    style: 'Modern',
    symbol: '',
    keywords: '',
    audience: '',
  });

  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { businessName, tagline, symbol } = formData;

    if (businessName.length > 50) {
      setError('Business Name must be 50 characters or less.');
      return;
    }
    if (tagline.length > 100) {
      setError('Tagline must be 100 characters or less.');
      return;
    }
    if (symbol.length > 30) {
      setError('Symbol must be 30 characters or less.');
      return;
    }

    setError(''); // clear previous error

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/generate_logo',
        formData,
      );
      setImageURL(response.data.image_url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/download_logo',
        { image_url: imageURL },
        { responseType: 'blob' },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated_logo.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  return (
    <div className="generate-logo-container">
      <h2 className="generate-logo-heading">Generate Logo</h2>
      <div className="generate-logo">
        <form onSubmit={handleSubmit} className="form">
          <label>
            Business Name:
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              maxLength="50"
            />
          </label>
          <label>
            Tagline:
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              maxLength="100"
            />
          </label>
          <label>
            Industry:
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label>
            Color Scheme:
            <select
              name="colorScheme"
              value={formData.colorScheme}
              onChange={handleChange}
            >
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label>
            Style:
            <select name="style" value={formData.style} onChange={handleChange}>
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
              <option value="Abstract">Abstract</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label>
            Symbol (e.g., star, heart, tree):
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              maxLength="30"
              placeholder="e.g., star, heart, tree"
            />
          </label>
          <label>
            Keywords:
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Enter keywords separated by commas"
            />
          </label>
          <label>
            Audience:
            <input
              type="text"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              placeholder="Enter audience types separated by commas"
            />
          </label>
          <button type="submit">Generate</button>
          {error && <p className="error">{error}</p>}
        </form>
        {imageURL && (
          <div className="generated-logo">
            <h3>Generated Logo</h3>
            <img src={imageURL} alt="Generated Logo" width="256" height="256" />
            <button onClick={downloadImage}>Download Logo</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateLogo;
