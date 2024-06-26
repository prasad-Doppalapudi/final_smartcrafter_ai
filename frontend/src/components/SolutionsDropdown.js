// SolutionsDropdown.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import './SolutionsDropdown.css';

function SolutionsDropdown({ onClose }) {
  const [isActive, setIsActive] = useState(false);

  const solutions = [
    { path: '/solutions/language-converter', label: 'Language Converter' },
    { path: '/solutions/speech-to-text', label: 'Speech to Text' },
    { path: '/solutions/text-to-speech', label: 'Text to Speech' },
    { path: '/solutions/detach-audio', label: 'Detach Audio from Video' },
    { path: '/solutions/content-generator', label: 'Content Creator' },
    { path: '/solutions/image-generator', label: 'Image Generator' },
  ];

  const handleClick = path => {
    setIsActive(false);
    onClose(); // Close the dropdown
  };

  return (
    <div className={`solutions-dropdown ${isActive ? 'active' : ''}`}>
      <ul>
        {solutions.map(solution => (
          <li key={solution.path}>
            <Link to={solution.path} onClick={() => handleClick(solution.path)}>
              {solution.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SolutionsDropdown;
