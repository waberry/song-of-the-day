import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import './Navbar.css'; // Import your CSS file later

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="container">
        {/* Logo */}
        <div className="logo">
            <p>LOGO</p>
          {/* Add your logo image or text here */}
        </div>

        {/* Navigation links */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <p>Home</p>
          </li>
          <li>
            <p>About</p>
          </li>
          <li>
            <p>Sign In</p>
          </li>
        </ul>

        {/* Burger menu button */}
        <button className="burger-menu" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
