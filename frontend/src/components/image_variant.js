import React, { useState } from 'react';
import axios from 'axios';
import './image_variant.css';

const ImageVariant = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [prompt, setPrompt] = useState('');
  const [modifiedImageURL, setModifiedImageURL] = useState('');
  const [option, setOption] = useState('change_background');

  const handleImageUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOptionChange = e => {
    setOption(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/modifyImage', {
        image_url: imageURL,
        prompt: `${option}: ${prompt}`,
      });
      setModifiedImageURL(response.data.modified_image_url);
    } catch (error) {
      console.error('Error modifying image:', error);
    }
  };

  return (
    <div className="image-variant">
      <h1>Modify Your Image</h1>
      <input type="file" onChange={handleImageUpload} />
      <div className="options">
        <select value={option} onChange={handleOptionChange}>
          <option value="change_background">Change Background</option>
          <option value="add_text">Add Text</option>
          <option value="remove">Remove</option>
        </select>
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <div className="image-preview">
        {imageURL && <img src={imageURL} alt="Uploaded" />}
        {modifiedImageURL && <img src={modifiedImageURL} alt="Modified" />}
      </div>
    </div>
  );
};

export default ImageVariant;
