// Core
import React, { FunctionComponent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
// Styles
import './ContactPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';
import PageFooter from '../layout/PageFooter';

// Component
const ContactPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <MobileHeader>
        <h1>{t('nav.contact')}</h1>
      </MobileHeader>
      <PageBody>
        <div className="ContactPage">
          <h1>DESIGN IS WORK IN PROGRESS</h1>
          {/* Hunger Free OK */}
          <h2>Contact Us</h2>
          Hunger Free Oklahoma 918-340-9098 info@hungerfreeok.org
          <br />
          <br />
          <h3>Contact us for questions about:</h3>
          <ul>
            <li>Using the map or locating a site near you</li>
            <li>Ordering outreach materials</li>
            <li>Connecting to existing programs</li>
            <li>Reporting broken links or inaccurate information on the map</li>
            <li>Getting involved next summer as a sponsor or site</li>
            <li>Ordering outreach materials</li>
          </ul>
          <br />
          <br />
          <hr />
          <br />
          <br />
          {/* OSDE */}
          <h2>Oklahoma State Department of Education</h2>
          <br />
          Child Nutrition Programs
          <br />
          Dee Houston
          <br />
          405-522-4943
          <br />
          Dee.houston@sde.ok.gov
          <h3>Contact us for questions about:</h3>
          <ul>
            <li>Reporting inaccurate information</li>
            <li>Reporting an issue with a site or sponsor</li>
            <li>Getting involved next summer as a sponsor or site</li>
          </ul>
          <br />
          <strong>If you need immediate assistance, please call 211.</strong>
        </div>
      </PageBody>
      <PageFooter />
    </Fragment>
  );
};

// Export
export default ContactPage;
