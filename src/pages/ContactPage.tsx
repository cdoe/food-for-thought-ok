// Core
import React, { FunctionComponent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
// Styles
import './ContactPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';
import PageFooter from '../layout/PageFooter';
import Icon from '../components/Icon';

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
          <div className="contact-flex-wrapper">
            <div className="contact-block">
              {/* Hunger Free OK */}
              <div className="contact-tag">{t('contact.contact')}</div>
              <h2 className="name">Hunger Free Oklahoma</h2>
              <div className="questions-about-tag">{t('contact.forQuestionsAbout')}</div>
              <ul>
                <li>{t('contact.contactHungerFree_01')}</li>
                <li>{t('contact.contactOsde_01')}</li>
                {/* <li>{t('contact.contactHungerFree_02')}</li> */}
                {/* <li>{t('contact.contactHungerFree_03')}</li> */}
                <li>{t('contact.contactHungerFree_04')}</li>
                {/* <li>{t('contact.contactHungerFree_05')}</li> */}
                {/* <li>{t('contact.contactHungerFree_06')}</li> */}
              </ul>
              <div className="wavy-line-divider" />
              {/* <h3 className="contact-name">{t('contact.callOrText')}</h3> */}
              {/* <a className="phone-link" href="tel:918-340-9098">
                <Icon icon="phone" /> 918-340-9098
              </a> */}
              <a className="email-link" href="mailto:info@hungerfreeok.org">
                <Icon icon="email" /> info@hungerfreeok.org
              </a>
            </div>
            {/* OSDE */}
            <div className="contact-block">
              <div className="contact-tag">{t('contact.contact')}</div>
              <h2 className="name">Oklahoma State Department of Education</h2>
              <div className="questions-about-tag">{t('contact.forQuestionsAbout')}</div>
              <ul>
                {/* This #2 changed to hunger-free side for covid */}
                {/* <li>{t('contact.contactOsde_01')}</li> */}
                <li>{t('contact.contactOsde_02')}</li>
                {/* <li>{t('contact.contactOsde_03')}</li> */}
              </ul>
              <div className="wavy-line-divider" />
              <h3 className="contact-name">
                Dee Houston
                <br />
                Child Nutrition Programs
              </h3>
              <a className="phone-link" href="tel:405-522-4943">
                <Icon icon="phone" /> 405-522-4943
              </a>
              <a className="email-link" href="mailto:Dee.houston@sde.ok.gov">
                <Icon icon="email" /> Dee.houston@sde.ok.gov
              </a>
            </div>
          </div>
          <div className="immediate-assistance">{t('contact.immediateAssistance')}</div>
        </div>
      </PageBody>
      <PageFooter />
    </Fragment>
  );
};

// Export
export default ContactPage;
