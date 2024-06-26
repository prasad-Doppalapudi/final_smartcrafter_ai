import React, { useState } from 'react';
import axios from 'axios';
import './ContentGenerator.css';

function ContentGenerator() {
  const [userInput, setUserInput] = useState('');
  const [industry, setIndustry] = useState('');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  const allowedIndustries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Entertainment',
  ];

  const handleInputChange = event => {
    const value = event.target.value;
    if (
      /drop\s+table|select\s+\*|<script>|<\/script>|porn|explicit|adult/i.test(
        value,
      )
    ) {
      setError('Input contains restricted content.');
    } else if (/image|picture|photo/i.test(value)) {
      setError(
        'I can only help with creating articles in the fields of Technology, Finance, Healthcare, Education, Entertainment. For image-related queries, please use a different service.',
      );
    } else {
      setError('');
      setUserInput(value);
    }
  };

  const handleIndustryChange = event => {
    setIndustry(event.target.value);
    setTopic(''); // Reset topic when industry changes
  };

  const handleTopicChange = event => {
    setTopic(event.target.value);
  };

  const getPlaceholder = industry => {
    const placeholders = {
      Technology: 'e.g., AI in healthcare',
      Finance: 'e.g., Cryptocurrency trends',
      Healthcare: 'e.g., Telemedicine advancements',
      Education: 'e.g., Online learning platforms',
      Entertainment: 'e.g., Future of streaming services',
    };
    return placeholders[industry] || 'Select an industry first...';
  };

  const handleClick = async () => {
    if (error) {
      alert('Please address the error before proceeding.');
      return;
    }

    if (!allowedIndustries.includes(industry)) {
      setGeneratedContent(
        `I can only help with creating articles in the fields of ${allowedIndustries.join(', ')}.`,
      );
      return;
    }

    const url = 'http://127.0.0.1:5000/generate_content';
    const data = {
      prompt: `${industry}: ${userInput}`,
      industry: industry,
      topic: topic,
      maxLength: 500, // Fixed maximum length for content
    };

    try {
      const response = await axios.post(url, data);
      if (response.status === 200 && response.data.content) {
        setGeneratedContent(response.data.content);
        setUserInput(''); // Optionally clear input after successful generation
      } else {
        setError('Failed to generate content');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Generate Your Content</h1>
      <div className="input-container">
        <label htmlFor="articleInput">Article on</label>
        <input
          id="articleInput"
          type="text"
          placeholder="Enter article name..."
          value={userInput}
          onChange={handleInputChange}
          maxLength="500"
        />
        <select value={industry} onChange={handleIndustryChange}>
          <option value="">Select Industry</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <input
          type="text"
          placeholder={getPlaceholder(industry)}
          value={topic}
          onChange={handleTopicChange}
        />
        <button onClick={handleClick}>Generate Content</button>
      </div>
      {generatedContent && (
        <div className="generated-content">
          <h2>Generated Content:</h2>
          <p>{generatedContent}</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ContentGenerator;
