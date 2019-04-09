// Core
import React, { FunctionComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
// Styles
import './LandingPage.scss';
// Components
import Icon from '../components/Icon';
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';
// Images
import logo from '../img/food-for-thought-logo.png';

// Component
const LandingPage: FunctionComponent = () => {
  return (
    <Fragment>
      <MobileHeader />
      <PageBody>
        <div id="LandingPage">
          <img className="logo" src={logo} alt="Food for Thought OK - logo" />
          <h1>
            No-cost meals for kids... <span>ALL&nbsp;SUMMER!</span>
          </h1>
          <p>
            While school is out for the summer, over 100 sponsoring organizations, serving hundreds
            of sites across the state, provide no-cost meals to kids 18 and younger. Many sites
            serve both breakfast and lunch or lunch and a snack.
          </p>
          <Link to="/locations">
            <button className="find-location-btn">
              <Icon icon="my_location" />
              Find a location near me
            </button>
          </Link>
          <Link to="faq" className="learn-more-link">
            or learn more
          </Link>
        </div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default LandingPage;
