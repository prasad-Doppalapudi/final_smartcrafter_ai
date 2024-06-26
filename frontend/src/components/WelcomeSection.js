import React from 'react';
import './WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <div className="welcome-section">
      <h1>Welcome to SmartCrafter AI</h1>
      <p>
        SmartCrafter.ai empowers you with the ability to seamlessly convert text
        to speech and speech to text in the language of your choice. But that's
        not all. You have the flexibility to extract audio from video and
        transcribe it or effortlessly switch the audio language.
      </p>
      <p>
        If you’re a content creator, <span>SmartCrafter.ai</span> is your go-to
        platform. Craft SEO-friendly content on any topic, and with the option
        to change the language, publish it for users across different regions to
        engage with.
      </p>
      <p>
        Elevate your content creation experience with{' '}
        <span>SmartCrafter.ai</span> – where language is no barrier and
        possibilities are endless.
      </p>
      <div className="cta">
        <a href="#solutions-section">Explore Our Solutions</a>
      </div>
    </div>
  );
};

export default WelcomeSection;
