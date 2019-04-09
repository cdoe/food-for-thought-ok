// Core
import React, { FunctionComponent, Fragment } from 'react';
// Styles
import './ContactPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';

// Component
const ContactPage: FunctionComponent = () => {
  return (
    <Fragment>
      <MobileHeader>
        <h1>Contact</h1>
      </MobileHeader>
      <PageBody>
        <div id="ContactPage">Contact Page</div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default ContactPage;
