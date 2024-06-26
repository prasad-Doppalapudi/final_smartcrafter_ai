import React from 'react';
import './ProductExplanationVideo.css';

const ProductExplanationVideo = () => {
  return (
    <div className="video-section">
      <h2>Product Overview</h2>
      <iframe
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        //src="../frontend/public/IntroductoryVideo.mp4"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="Product Overview Video"
      ></iframe>
    </div>
  );
};

export default ProductExplanationVideo;
