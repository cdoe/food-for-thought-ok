// Core
import React, { FunctionComponent, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MobileNavCtx } from '../App';
// Styles
import './MobileNav.scss';
// Components
import Icon from '../components/Icon';
// Images
import logo from '../img/food-for-thought-logo.png';
import LanguageSelector from './LanguageSelector';

// Component
const MobileNav: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useContext(MobileNavCtx);

  return (
    <div id="MobileNav" className={isOpen ? 'open' : ''}>
      {/* Background Fader (closes menu on click) */}
      <div
        className={isOpen ? 'nav-fader open' : 'nav-fader'}
        onClick={event => {
          event.preventDefault();
          setIsOpen(false);
        }}
      />
      {/* Mobile menu */}
      <div className={isOpen ? 'nav-wrapper open' : 'nav-wrapper'}>
        {/* Close nav button */}
        <button
          className="close-nav-btn"
          onClick={event => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <Icon icon="close" />
        </button>
        {/* Logo */}
        <Link
          to="/"
          className="logo-link"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <img src={logo} alt="Food for Thought OK - logo" />
        </Link>
        {/* List of links (close menu on click) */}
        <div className="nav-links">
          {/* Map */}
          <NavLink
            className="nav-link"
            to="/locations"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Icon icon="map" />
            Map
          </NavLink>
          {/* FAQ */}
          <NavLink
            className="nav-link"
            to="/faq"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Icon icon="help" />
            FAQ
          </NavLink>
          {/* Contact */}
          <NavLink
            className="nav-link"
            to="/contact"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Icon icon="call" />
            Contact
          </NavLink>
        </div>
        {/* Footer with language selector */}
        <div className="nav-footer">
          <div className="select-language">Select language:</div>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

// Export
export default MobileNav;
