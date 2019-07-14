// Core
import React, { FunctionComponent, Fragment, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
// Styles
import './FaqPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';
import PageFooter from '../layout/PageFooter';
import Icon from '../components/Icon';
// Images
import HungerFreeOk from '../img/hunger-free-ok.png';
import OSDE from '../img/osde.png';
import CodeForTulsa from '../img/code-for-tulsa.png';

const QuestionAnswerBlock: FunctionComponent<{ question: ReactNode; answer: ReactNode }> = ({
  question,
  answer
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Fragment>
      <button
        className="question-btn"
        onClick={e => {
          e.preventDefault();
          setExpanded(!expanded);
        }}
      >
        <Icon icon={expanded ? 'arrow_drop_down' : 'arrow_right'} />
        {question}
      </button>
      {expanded && <div className="answer">{answer}</div>}
      <div className="divider" />
    </Fragment>
  );
};

// Component
const FaqPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <MobileHeader>
        <h1>{t('nav.faq')}</h1>
      </MobileHeader>
      <PageBody>
        <div className="FaqPage">
          {/* 1. */}
          {/* What is the Summer Food Service Program (SFSP)? */}
          <QuestionAnswerBlock question={t('faq.whatIsSfsp')} answer={t('faq.SfspDescrip')} />

          {/* 2. */}
          {/* Do I need to provide any identification or paperwork to receive a meal? */}
          <QuestionAnswerBlock question={t('faq.doINeedId')} answer={t('faq.noIdRequired')} />

          {/* 3. */}
          {/* Who is eligible to receive meals? */}
          <QuestionAnswerBlock
            question={t('faq.whoIsEligible')}
            answer={t('faq.childrenAndTeensEligible')}
          />

          {/* 4. */}
          {/* Can meals be taken home? */}
          <QuestionAnswerBlock question={t('faq.canMealsBeTaken')} answer={t('faq.noMealsTaken')} />

          {/* 5. */}
          {/* How do I find a site near me? */}
          <QuestionAnswerBlock
            question={t('faq.howDoIFindSite')}
            answer={
              <ul>
                <li>{t('faq.findSiteStep_01')}</li>
                <li>{t('faq.findSiteStep_02')}</li>
                <li>{t('faq.findSiteStep_03')}</li>
                <li>{t('faq.findSiteStep_04')}</li>
                <li>{t('faq.findSiteStep_05')}</li>
              </ul>
            }
          />

          {/* 5. */}
          {/* Where can I find more information about the Summer Food Service Program (SFSP)? */}
          <QuestionAnswerBlock
            question={t('faq.whereCanIFind')}
            answer={
              <a
                href="https://www.fns.usda.gov/sfsp/summer-food-service-program"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('faq.SFSPLinkText')}
              </a>
            }
          />

          {/* About website */}
          <div className="secondary-header">{t('faq.aboutPartners')}</div>
          <div className="about-website">{t('faq.aboutWebsite')}</div>

          {/* About partners */}
          <div className="partners-flex-wrapper">
            {/* HFOK */}
            <div className="partner-block">
              <a href="https://hungerfreeok.org/" target="_blank" rel="noopener noreferrer">
                <img alt="Hunger Free Oklahoma - Logo" src={HungerFreeOk} />
              </a>
              <div className="partner-description">{t('faq.hungerFreeOkDescrip')}</div>
            </div>

            {/* OSDE */}
            <div className="partner-block">
              <a href="https://sde.ok.gov/" target="_blank" rel="noopener noreferrer">
                <img alt="Oklahoma State Department of Education logo - Logo" src={OSDE} />
              </a>
              <div className="partner-description">{t('faq.osdeDescrip')}</div>
            </div>

            {/* CFT */}
            <div className="partner-block">
              <a href="https://codefortulsa.org/" target="_blank" rel="noopener noreferrer">
                <img alt="Code for Tulsa - Logo" src={CodeForTulsa} />
              </a>
              <div className="partner-description">{t('faq.codeForTulsaDescrip')}</div>
            </div>
          </div>
        </div>
      </PageBody>
      <PageFooter />
    </Fragment>
  );
};

// Export
export default FaqPage;
