// Core
import React, { FunctionComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Styles
import './LandingPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import LanguageSelector from '../layout/LanguageSelector';
import PageBody from '../layout/PageBody';
import Icon from '../components/Icon';
// Images
import logo from '../img/food-for-thought-logo.png';

// Component
const LandingPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <MobileHeader>
        <LanguageSelector alignRight />
      </MobileHeader>
      <PageBody>
        <div className="LandingPage">
          <img className="logo" src={logo} alt="Food for Thought OK - logo" />
          <h1>
            {t('landing.headline')} <span>{t('landing.headlineBold')}</span>
          </h1>
          <div className="inverted-copy">
            <p>{t('landing.supportingCopy')}</p>
            <Link to="/locations">
              <button className="find-location-btn">
                <Icon icon="my_location" />
                {t('landing.findLocation')}
              </button>
            </Link>
            <Link to="faq" className="learn-more-link">
              {t('landing.learnMore')}
            </Link>
          </div>
        </div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default LandingPage;
