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

const questionAnswerBlock: FunctionComponent<{ question: ReactNode; answer: ReactNode }> = ({
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

  // const [answer1expanded, setAnswer1expanded] = useState(false);
  // const [answer2expanded, setAnswer2expanded] = useState(false);
  // const [answer3expanded, setAnswer3expanded] = useState(false);
  // const [answer4expanded, setAnswer4expanded] = useState(false);
  // const [answer5expanded, setAnswer5expanded] = useState(false);

  return (
    <Fragment>
      <MobileHeader>
        <h1>{t('nav.faq')}</h1>
      </MobileHeader>
      <PageBody>
        <div className="FaqPage">
          {/* 1. */}
          {/* What is the Summer Food Service Program (SFSP)? */}
          {questionAnswerBlock({ question: t('faq.whatIsSfsp'), answer: t('faq.SfspDescrip') })}

          {/* 2. */}
          {/* Do I need to provide any identification or paperwork to receive a meal? */}
          {questionAnswerBlock({ question: t('faq.doINeedId'), answer: t('faq.noIdRequired') })}

          {/* 3. */}
          {/* Who is eligible to receive meals? */}
          {questionAnswerBlock({
            question: t('faq.whoIsEligible'),
            answer: t('faq.childrenAndTeensEligible')
          })}

          {/* 4. */}
          {/* Can meals be taken home? */}
          {questionAnswerBlock({
            question: t('faq.canMealsBeTaken'),
            answer: t('faq.noMealsTaken')
          })}

          {/* 5. */}
          {/* How do I find a site near me? */}
          {questionAnswerBlock({
            question: t('faq.howDoIFindSite'),
            answer: (
              <ul>
                <li>{t('faq.findSiteStep_01')}</li>
                <li>{t('faq.findSiteStep_02')}</li>
                <li>{t('faq.findSiteStep_03')}</li>
                <li>{t('faq.findSiteStep_04')}</li>
                <li>{t('faq.findSiteStep_05')}</li>
              </ul>
            )
          })}

          {/* About website */}
          <div className="secondary-header">About the partners:</div>
          <div className="about-website">
            This map was created in partnership with Hunger Free Oklahoma, the Oklahoma State
            Department of Education, and Code for Tulsa to help families locate summer meal sites
            faster than ever before.
          </div>

          {/* About partners */}
          <div className="partners-flex-wrapper">
            {/* HFOK */}
            <div className="partner-block">
              <img alt="Hunger Free Oklahoma - Logo" src={HungerFreeOk} />
              <div className="partner-description">
                Hunger Free Oklahoma works to bring a unified, statewide voice to the issues and
                solutions surrounding hunger, with a goal to ensure all Oklahomans have access to
                affordable, nutritious food. We are leveraging the power of collaboration to solve
                hunger in Oklahoma by improving systems, policies, and practices.
              </div>
            </div>

            {/* OSDE */}
            <div className="partner-block">
              <img alt="Oklahoma State Department of Education logo - Logo" src={OSDE} />
              <div className="partner-description">
                The Oklahoma State Department of Education is charged with determining the policies
                and directing the administration and supervision of the public school system of
                Oklahoma. This includes administering the summer meals program, school breakfast and
                lunch programs, and afterschool meal programs.
              </div>
            </div>

            {/* CFT */}
            <div className="partner-block">
              <img alt="Code for Tulsa - Logo" src={CodeForTulsa} />
              <div className="partner-description">
                Code for Tulsa is among about 70 Code for America “brigades” nationwide that help
                code and data specialist bring their technology skills to the process of connecting
                people to their local governments. The Tulsa brigade was one of the earliest to
                organize as the Code for America ideas expanded starting in 2009.
              </div>
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
