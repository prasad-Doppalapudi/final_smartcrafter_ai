import React from 'react';
import './ProductExplanationVideo.css';

const ProductExplanationVideo = () => {
  return (
    <div className="video-section">
      <h2>Product Overview</h2>
      <iframe
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Product Overview Video"
      ></iframe>
    </div>
  );
};

export default ProductExplanationVideo;
