// Core
import React, { FunctionComponent, Fragment, useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
// Styles
import './LocationsPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import Input from '../components/Input';
import Icon from '../components/Icon';
import LocationItemLink from '../components/locations/LocationItemLink';
import LocationDetail from '../components/locations/LocationDetail';
// MOCK TMP
// XXX TODO : REMOVE
import locations from '../lib/mock-locations';

const OpenNowFilter: FunctionComponent = () => {
  const [openNowFilter, setOpenNowFilter] = useState(false);

  return (
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
  );
};

// Component
const LocationsPage: FunctionComponent<RouteComponentProps<{ locationId?: string }>> = ({
  match
}) => {
  // Mobile list and details states
  const [mobileListIsOpen, setMobileListIsOpen] = useState(false);
  const [mobileDetailsExpanded, setMobileDetailsExpanded] = useState(false);

  // Get locationId from URL (if exists)
  const locationIdParam = match.params.locationId;
  // Store as state to use for details view
  const [locationId, setLocationId] = useState(locationIdParam);

  // Effect triggered when locationId in URL changes
  useEffect(() => {
    // If location id is present in URL, set locationId state
    !!locationIdParam && setLocationId(locationIdParam);
    // Close mobile list view if showing location details
    // !!locationIdParam && setMobileListIsOpen(false);

    !locationIdParam &&
      setTimeout(() => {
        // If location is removed from url, set delay before removing from state
        // allowing detail view to animate out
        setLocationId(undefined);
        // If location is removed from url, collapse mobile details
        // so next time opened is defaulted to not expanded
        // (is within timout to prevent interference with css transitions)
        setMobileDetailsExpanded(false);
      }, 500);
  }, [locationIdParam]);

  // On load, scroll to first location (past filter/sort)
  const locationsListRef: any = useRef(null);
  useEffect(() => {
    if (locationsListRef.current) {
      locationsListRef.current.scrollTop = 58;
    }
  }, []);

  return (
    <Fragment>
      {/* Nearby search on mobile */}
      {/* and the OpenNowFilter only shows on mobile when location detail view isn't active */}
      <MobileHeader bottom={!!locationIdParam ? undefined : <OpenNowFilter />}>
        {/* <MobileHeader> */}
        <Input type="text" placeholder="Enter your address or Zip code" />
      </MobileHeader>

      {/* Rest of the locations page */}
      <div className="LocationsPage">
        {/* Flex wrapper including embedded map and locations side bar */}
        <div className="list-and-map-wrapper">
          {/* Locations list side bar (formatted a little different on mobile) */}
          <div
            ref={locationsListRef}
            className={classnames('locations-list', { open: mobileListIsOpen && !locationIdParam })}
          >
            {/* Nearby search NOT for mobile */}
            <div className="desktop-search">
              <Input type="text" placeholder="Enter your address or Zip code" />
              <OpenNowFilter />
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
              <LocationItemLink key={location.id} location={location} />
            ))}
          </div>

          {/* Embedded map */}
          <div className="map-embed">Map Placeholder</div>
          {/* Location detail panel */}
          <div
            className={classnames('location-detail-panel', {
              open: !!locationIdParam,
              expanded: mobileDetailsExpanded
            })}
          >
            <Link to="/locations/" className="back-link">
              <Icon icon="arrow_back" /> Back
            </Link>
            <LocationDetail
              location={locations.find(
                location => location.id === locationIdParam || location.id === locationId
              )}
              mobileExpanded={mobileDetailsExpanded}
            />
          </div>
        </div>

        {/* Mobile toggler for map vs. list (if not in detail view) */}
        {!locationIdParam && (
          <div
            className="mobile-toggle"
            onClick={event => {
              event.preventDefault();
              setMobileListIsOpen(!mobileListIsOpen);
            }}
          >
            {mobileListIsOpen ? (
              <IconText icon="map" text="Show map" />
            ) : (
              <IconText icon="list" text="Show list" />
            )}
          </div>
        )}

        {/* Mobile toggler for expanded vs. collapsed details (when in detail view) */}
        {!!locationIdParam && (
          <div
            className="mobile-toggle centered"
            onClick={event => {
              event.preventDefault();
              setMobileDetailsExpanded(!mobileDetailsExpanded);
            }}
          >
            {mobileDetailsExpanded ? (
              <IconText icon="expand_more" text="Collapse details" />
            ) : (
              <IconText icon="expand_less" text="Expand details" />
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

// Used in mobile toggler above
const IconText: FunctionComponent<{ icon: string; text: string }> = ({ icon, text }) => (
  <Fragment>
    <Icon icon={icon} /> {text}
  </Fragment>
);

// Export
export default LocationsPage;
