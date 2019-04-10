// Core
import React, { FunctionComponent, Fragment, useState, useRef, useEffect } from 'react';
// Styles
import './LocationsPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import Input from '../components/Input';
import Icon from '../components/Icon';
// MOCK TMP
// XXX TODO : REMOVE
import locations from '../lib/mock-locations';
import LocationItem from '../components/LocationItem';

const TmpSearch: FunctionComponent = () => {
  const [openNowFilter, setOpenNowFilter] = useState(false);

  return (
    <Fragment>
      <Input type="text" placeholder="Enter your address or Zip code" />
      <div className="open-now-filter">
        <button
          className={openNowFilter ? '' : 'active'}
          onClick={e => {
            e.preventDefault();
            setOpenNowFilter(false);
          }}
        >
          All locations
        </button>
        <button
          className={openNowFilter ? 'active' : ''}
          onClick={e => {
            e.preventDefault();
            setOpenNowFilter(true);
          }}
        >
          Open now
        </button>
      </div>
    </Fragment>
  );
};

// Component
const LocationsPage: FunctionComponent = () => {
  const [mobileListIsOpen, setMobileListIsOpen] = useState(false);
  const locationsListRef: any = useRef(null);
  useEffect(() => {
    if (locationsListRef.current) {
      locationsListRef.current.scrollTop = 58;
    }
  }, []);

  return (
    <Fragment>
      <MobileHeader>
        {/* Nearby search on mobile */}
        <div className="mobile-search">
          <TmpSearch />
        </div>
      </MobileHeader>
      <div className="LocationsPage">
        <div className="maps-wrapper">
          <div
            ref={locationsListRef}
            className={mobileListIsOpen ? 'locations-list open' : 'locations-list'}
          >
            {/* Nearby search NOT for mobile */}
            <div className="desktop-search">
              <TmpSearch />
            </div>
            {/* Filter + sort locations  */}
            <div className="filter-sort-locations">
              <div className="filter-locations">
                <Icon icon="search" />
                Filter locations
              </div>
              <div className="sort-locations">
                <Icon icon="arrow_drop_down" />
                Sort by nearby
              </div>
            </div>
            {/* Locations list */}
            {locations.map(location => (
              <LocationItem key={location.name + location.address} location={location} />
            ))}
          </div>
          <div className="map-embed">Map Placeholder</div>
        </div>
        <div
          className="mobile-toggle"
          onClick={event => {
            event.preventDefault();
            setMobileListIsOpen(!mobileListIsOpen);
          }}
        >
          {mobileListIsOpen ? (
            <Fragment>
              <Icon icon="map" /> Show Map
            </Fragment>
          ) : (
            <Fragment>
              <Icon icon="list" />
              Show List
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

// Export
export default LocationsPage;
