// Core
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
// Styles
import './LanguageSelector.scss';

// Component
const LanguageSelector: FunctionComponent<{ alignRight?: boolean }> = ({ alignRight = false }) => {
  const { i18n } = useTranslation();
  return (
    <div className={alignRight ? 'LanguageSelector align-right' : 'LanguageSelector'}>
      <button
        className={i18n.language === 'en' || i18n.language === 'en-US' ? 'active' : ''}
        onClick={event => {
          event.preventDefault();
          i18n.changeLanguage('en-US');
        }}
      >
        English
      </button>
      <button
        className={i18n.language === 'es' ? 'active' : ''}
        onClick={event => {
          event.preventDefault();
          i18n.changeLanguage('es');
        }}
      >
        Español
      </button>
    </div>
  );
};

// Export
export default LanguageSelector;
