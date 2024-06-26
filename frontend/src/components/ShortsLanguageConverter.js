import React, { useState } from 'react';
import axios from 'axios';
import './ShortsLanguageConverter.css';

function ShortsLanguageConverter() {
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translationStatus, setTranslationStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleLanguageChange = e => {
    setTargetLanguage(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file || !targetLanguage) {
      setTranslationStatus(
        'Please upload a file and select a target language.',
      );
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_language', targetLanguage);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/translate-video',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // Add this line to include credentials with requests
          timeout: 300000,
        },
      );

      if (response.data && response.data.translated_video_url) {
        setDownloadUrl(response.data.translated_video_url);
        setTranslationStatus(
          'Translation successful! Click the link below to download the video.',
        );
      } else {
        setTranslationStatus('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        setTranslationStatus('Error translating video. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setTranslationStatus('Error translating video. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        setTranslationStatus('Error translating video. Please try again.');
      }
    }
  };

  return (
    <div className="shorts-language-converter">
      <h2>Shorts Language Converter</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Upload Video:
          <input type="file" onChange={handleFileChange} accept="video/*" />
        </label>
        <label>
          Target Language:
          <select value={targetLanguage} onChange={handleLanguageChange}>
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="telugu">telugu</option>
            <option value="spanish">Spanish</option>
            <option value="mandarin">Mandarin (Chinese)</option>
            <option value="german">German</option>
            <option value="hindi">Hindi</option>
          </select>
        </label>
        <button type="submit">Convert Language</button>
      </form>
      {translationStatus && <p>{translationStatus}</p>}
      {downloadUrl && (
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          Download Translated Video
        </a>
      )}
    </div>
  );
}

export default ShortsLanguageConverter;
