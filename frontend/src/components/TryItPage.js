import React from 'react';
import './PricingSection.css';

const PricingSection = () => {
  return (
    <div className="pricing-section">
      <h2>Try it for Month</h2>
      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>Free (per Month)</h3>
          <ul>
            <li>Convert 1000 words to Audio</li>
            <li>Convert 5 minutes of Audio file to Text</li>
            <li>Create content of 1000 words</li>
            <li>Change Language for audio file of 5 mins</li>
            <li>Change Language for Text file max of 1000 words</li>
            <li>Unlimited extraction of Audio from Video</li>
            <li>No Credit Card required</li>
            <li>Cancel anytime</li>
          </ul>
          <div className="cta">
            <a href="#signup-section">Try it for Free</a>
          </div>
        </div>
        <div className="pricing-card">
          <h3>Launch Pack $25 per Month</h3>
          <ul>
            <li>Convert 5000 words to Audio</li>
            <li>Convert 50 minutes of Audio file to Text</li>
            <li>Create content of 5000 words</li>
            <li>Change Language for audio file of 25 mins</li>
            <li>Change Language for Text file max of 5000 words</li>
            <li>Unlimited extraction of Audio from Video</li>
          </ul>
          <div className="cta">
            <a href="#signup-section">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
