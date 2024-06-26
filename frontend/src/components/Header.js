import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const loggedIn = localStorage.getItem('loggedIn');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('loggedIn');
    navigate('/loginform');
  };

  const handleNavigation = (path, hash) => {
    navigate(path);
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  return (
    <div className="header">
      <div className="company-logo" onClick={() => navigate('/')}>
        <img src={require('../images/logo.jpeg')} alt="Company Logo" />
      </div>
      <div className="header-links">
        <span
          onClick={() => navigate('/solutions')}
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Solutions
        </span>{' '}
        {/* Updated to navigate to /solutions */}
        <span
          onClick={() => handleNavigation('/', '#pricing-section')}
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Try it
        </span>
        {loggedIn && loggedIn ? (
          <span onClick={handleLogout}>Logout</span>
        ) : (
          <>
            <span onClick={() => navigate('/loginform')}>Login</span>
            <span onClick={() => navigate('/signupform')}>Sign Up</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
