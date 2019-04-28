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
import PageFooter from '../layout/PageFooter';

// Component
const LandingPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <MobileHeader>
        <LanguageSelector alignRight light />
      </MobileHeader>
      <PageBody>
        <div className="LandingPage">
          <div className="jumbotron">
            <div className="fader" />
            <h1>
              {t('landing.headline')} <span>{t('landing.headlineBold')}</span>
            </h1>
            <Link to="/locations">
              <button className="find-location-btn">
                <Icon icon="my_location" />
                {t('landing.findLocation')}
              </button>
            </Link>
          </div>
          <div className="wavebg" />
          <div className="inverted-copy">
            <p>{t('landing.supportingCopy')}</p>
          </div>
          <PageFooter />
        </div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default LandingPage;
