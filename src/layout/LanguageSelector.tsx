// Core
import React, { FunctionComponent, useContext } from 'react';
import { LanguageCtx } from '../App';
// Styles
import './LanguageSelector.scss';
// Components

// Component
const LanguageSelector: FunctionComponent = () => {
  const [language, setLanguage] = useContext(LanguageCtx);

  return (
    <div id="LanguageSelector">
      <button
        className={language === 'en' ? 'active' : ''}
        onClick={event => {
          event.preventDefault();
          setLanguage('en');
        }}
      >
        English
      </button>
      <button
        className={language === 'es' ? 'active' : ''}
        onClick={event => {
          event.preventDefault();
          setLanguage('es');
        }}
      >
        Español
      </button>
    </div>
  );
};

// Export
export default LanguageSelector;
