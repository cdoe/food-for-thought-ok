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
        <div className="ContactPage">{t('nav.contact')}</div>
      </PageBody>
      <PageFooter />
    </Fragment>
  );
};

// Export
export default ContactPage;
