// Core
import React, { FunctionComponent, Fragment, useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { CurrentUserCtx } from '../App';
// Styles
import './LandingPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import LanguageSelector from '../layout/LanguageSelector';
import PageBody from '../layout/PageBody';
import Icon from '../components/Icon';
import PageFooter from '../layout/PageFooter';
import Loader from '../components/Loader';
import SearchAutocomplete from '../components/locations/SearchAutocomplete';

// Component
const LandingPage: FunctionComponent<RouteComponentProps> = ({ history }) => {
  const [currentUser, setCurrentUser] = useContext(CurrentUserCtx);
  const [isLoadingLocation, setLoadingLocation] = useState(false);
  const [autofocus, setAutofocus] = useState(false);
  const { t } = useTranslation();

  // When user clicks to get location
  const handleGetGeo = () => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Found! Set user's location in latLng
        setCurrentUser(currentUser => ({
          ...currentUser,
          hasGeoAccess: true,
          latLng: [position.coords.latitude, position.coords.longitude],
        }));
        // Go to locations page
        history.push('/locations');
      },
      err => {
        setAutofocus(true);
        setLoadingLocation(false);
        // Geolocation error
        setCurrentUser(currentUser => ({
          ...currentUser,
          hasGeoAccess: false,
        }));
        console.error('Error getting location: ', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 6500,
      }
    );
  };

  return (
    <Fragment>
      <MobileHeader>
        <LanguageSelector alignRight light />
      </MobileHeader>
      <PageBody>
        <div className="LandingPage">
          <div className="jumbotron">
            <div className="fader" />
            <h1>{t('landing.headline')}</h1>
            {/* Find locations button */}
            {currentUser.hasGeoAccess !== false && (
              <button
                className="find-location-btn"
                onClick={e => {
                  e.preventDefault();
                  setLoadingLocation(true);
                  handleGetGeo();
                }}
              >
                {isLoadingLocation ? (
                  <Loader />
                ) : (
                  <Fragment>
                    <Icon icon="my_location" />
                    {t('landing.findLocation')}
                  </Fragment>
                )}
              </button>
            )}
            {/* Type in location */}
            {currentUser.hasGeoAccess === false && (
              <div className="location-input">
                <div className="label">{t('landing.couldNotFind')}</div>
                <SearchAutocomplete history={history} autofocus={autofocus} redirectOnSuccess />
              </div>
            )}
            <h1>
              <span>{t('landing.subheadline')}</span>
            </h1>
          </div>
          <div className="wavebg" />
          <div className="inverted-copy">
            <p>
              <Trans i18nKey="landing.supportingCopy">
                Find a meal site near you during school closures due to COVID-19...
                <a
                  href="https://hungerfreeok.org/covid19/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>
              </Trans>
            </p>
          </div>
          <PageFooter />
        </div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default LandingPage;
