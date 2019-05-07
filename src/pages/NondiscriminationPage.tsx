// Core
import React, { FunctionComponent, Fragment } from 'react';
// Styles
import './NondiscriminationPage.scss';
// Layout
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';
import PageFooter from '../layout/PageFooter';

// Component
const NondiscriminationPage: FunctionComponent = () => {
  return (
    <Fragment>
      <MobileHeader />
      <PageBody>
        <div className="NondiscriminationPage">
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vSdja9e2NYtlTno9WREoypZP8FT6ub4h1gagrFfpPi7YcL1Gf44oz88-G02hxl__irDwv7c8Tgy1Je1/pub?embedded=true" />
        </div>
      </PageBody>
      <PageFooter />
    </Fragment>
  );
};
export default NondiscriminationPage;

// Component (spanish)
export const NondiscriminationPageSpanish: FunctionComponent = () => {
  return (
    <Fragment>
      <MobileHeader />
      <PageBody>
        <div className="NondiscriminationPage">
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vQSuQmi5bOE3Te1X7nNNtjxza2o510wpHWa9cjS3N9CgJw1rFOOvjpLDIi-pChab0CvTf5ZGm6fh4NW/pub?embedded=true" />
        </div>
      </PageBody>
      <PageFooter />
    </Fragment>
  );
};
