// Core
import React, { FunctionComponent, Fragment, useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
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

// declare global {
//   interface Window {
//     L: L;
//   }
// }

// Component
const LocationsPage: FunctionComponent<RouteComponentProps<{ locationId?: string }>> = ({
  history,
  match
}) => {
  const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2;
  // Mobile list and details states
  const [mobileListIsOpen, setMobileListIsOpen] = useState(false);
  const [mobileDetailsExpanded, setMobileDetailsExpanded] = useState(false);
  // const [leaflet, setLeaflet] = useState({});
  // Default to OKC
  const defaultMapCenter: [number, number] = [35.4823242, -97.7593689];
  const defaultMapZoom = 7;
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [mapZoom, setMapZoom] = useState(defaultMapZoom);

  // Get locationId from URL (if exists)
  const locationIdParam = match.params.locationId;
  // Store as state to use for details view
  const [locationId, setLocationId] = useState(locationIdParam);

  // Effect triggered when locationId in URL changes
  useEffect(() => {
    // If location id is present in URL (and is valid location), set locationId state
    // and center map at that location
    if (!!locationIdParam) {
      const location = locations.find(location => location.id === locationIdParam);
      if (location && location.lat && location.lng) {
        setLocationId(locationIdParam);
        setMapCenter([parseFloat(location.lat), parseFloat(location.lng)]);
        setMapZoom(12);
      } else {
        // If couldn't find location, set map to default settings
        setMapCenter(defaultMapCenter);
        setMapZoom(defaultMapZoom);
      }
    }
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

  // On load, load leaflet JS and map tiles into div#leaflet-map container
  // useEffect(() => {
  // var map = L.map('leaflet-map').setView([36.1522199, -96.0180911], 11);
  // L.tileLayer(
  //   'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2RvZSIsImEiOiJjanVmeGRmaGowZjM3NDlucXNocmZyZmZrIn0.zW5aLSTzrHl5OAx4YF4ETA',
  //   {
  //     attribution:
  //       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18
  //     // id: 'mapbox.streets',
  //     // accessToken: 'pk.eyJ1IjoiY2RvZSIsImEiOiJjanVmeGRmaGowZjM3NDlucXNocmZyZmZrIn0.zW5aLSTzrHl5OAx4YF4ETA'
  //   }
  // ).addTo(map);
  // }, []);

  // const handleLocationSelect = (e: MouseEvent) => {
  //   console.log('e', e);
  // };

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
          {/* <div id="leaflet-map" className="map-embed">
            Map Placeholder
          </div> */}
          <Map className="map-embed" center={mapCenter} zoom={mapZoom} animate={true}>
            <TileLayer
              access_token="pk.eyJ1IjoiY2RvZSIsImEiOiJjanVmeGRmaGowZjM3NDlucXNocmZyZmZrIn0.zW5aLSTzrHl5OAx4YF4ETA"
              id="mapbox.streets"
              subdomains="abcd"
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              // From CartoDB free map tiles: https://github.com/CartoDB/basemap-styles
              url={`https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}${
                retina ? '@2x' : ''
              }.png`}
              // url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}"
            />
            {locations.map(location => {
              if (location.lat && location.lng) {
                const latLng: [number, number] = [
                  parseFloat(location.lat),
                  parseFloat(location.lng)
                ];
                return (
                  <Marker
                    key={location.id}
                    position={latLng}
                    onClick={() => {
                      history.push('/locations/' + location.id);
                    }}
                  />
                );
              }
            })}
          </Map>
          {/* Location detail panel */}
          <div
            className={classnames('location-detail-panel', {
              open: !!locationIdParam,
              expanded: mobileDetailsExpanded
            })}
          >
            {/* Back arrow (but don't show on mobile expanded) */}
            {!mobileDetailsExpanded && (
              <Link to="/locations/" className="back-link">
                <Icon icon="arrow_back" /> Back
              </Link>
            )}
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
            className="mobile-toggle primary"
            onClick={event => {
              event.preventDefault();
              setMobileDetailsExpanded(!mobileDetailsExpanded);
            }}
          >
            {mobileDetailsExpanded ? (
              <IconText icon="expand_more" text="Show less" />
            ) : (
              <IconText icon="expand_less" text="Show more" />
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
