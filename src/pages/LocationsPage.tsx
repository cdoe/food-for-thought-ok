// Core
import React, { FunctionComponent, Fragment } from 'react';
// Styles
import './LocationsPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';

// Component
const LocationsPage: FunctionComponent = () => {
  return (
    <Fragment>
      <MobileHeader />
      <MobileHeader hideMenuButton>nearby | open now</MobileHeader>
      <PageBody>
        <div className="LocationsPage">Locations Page</div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default LocationsPage;
