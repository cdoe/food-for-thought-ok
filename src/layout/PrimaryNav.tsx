// Core
import React, { FunctionComponent } from 'react';
import { Link, NavLink } from 'react-router-dom';
// Styles
import './PrimaryNav.scss';
// Images
import logo from '../img/food-for-thought-logo-simple.png';
// Components
import LanguageSelector from './LanguageSelector';

// Component
const PrimaryNav: FunctionComponent = () => {
  return (
    <div id="PrimaryNav">
      {/* Logo */}
      <Link to="/" className="logo-link">
        <img src={logo} alt="Food for Thought OK - logo" />
      </Link>
      {/* List of links (close menu on click) */}
      <div className="nav-links">
        {/* Map */}
        <NavLink className="nav-link" to="/locations">
          Locations
        </NavLink>
        {/* FAQ */}
        <NavLink className="nav-link" to="/faq">
          FAQ
        </NavLink>
        {/* Contact */}
        <NavLink className="nav-link" to="/contact">
          Contact
        </NavLink>
      </div>
      <LanguageSelector />
    </div>
  );
};

// Export
export default PrimaryNav;
