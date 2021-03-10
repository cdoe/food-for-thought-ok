// Core
import React, { FunctionComponent, memo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Styles
import './PrimaryNav.scss';
// Images
import logo from '../img/food-for-thought-logo-words.png';
// Components
import LanguageSelector from './LanguageSelector';

// Component
const PrimaryNav: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="PrimaryNav">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <img src={logo} alt="Food for Thought OK - logo" />
        </Link>
        {/* List of links (close menu on click) */}
        <div className="nav-links">
          {/* Map */}
          <NavLink className="nav-link" to="/locations">
            {t('nav.locations')}
          </NavLink>
          {/* FAQ */}
          <NavLink className="nav-link" to="/faq">
            {t('nav.faq')}
          </NavLink>
          {/* Contact */}
          <NavLink className="nav-link" to="/contact">
            {t('nav.contact')}
          </NavLink>
        </div>
        <LanguageSelector />
      </div>
      {process.env.REACT_APP_ENV === 'proof' && (
        <div className="draft-notice">
          DRAFT WEBSITE: Please do not share or publish.
          <br />
          Video Instructions:{' '}
          <a href="https://vimeo.com/513048268" target="_blank" rel="noreferrer">
            Edit Single Mealsite
          </a>{' '}
          or{' '}
          <a href="https://vimeo.com/513045284" target="_blank" rel="noreferrer">
            Bulk Edit Mealsites
          </a>
        </div>
      )}
    </>
  );
};

// Export
export default memo(PrimaryNav);
