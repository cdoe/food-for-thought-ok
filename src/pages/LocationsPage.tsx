// Core
import React, { FunctionComponent, Fragment, useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet';
import Leaflet, { Map as LeafletElement, IconOptions } from 'leaflet';
// Styles
import './LocationsPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import Input from '../components/Input';
import Icon from '../components/Icon';
import LocationItemLink from '../components/locations/LocationItemLink';
import LocationDetail from '../components/locations/LocationDetail';
import InfiniteScroll from 'react-infinite-scroll-component';
// Images
import marker from '../img/marker.png';
import retinaMarker from '../img/marker@2x.png';
import markerShadow from '../img/marker-shadow.png';

// MOCK TMP
// XXX TODO : REMOVE
import locations from '../lib/mock-locations';

const mapIcon: IconOptions = {
  iconUrl: marker,
  iconRetinaUrl: retinaMarker,
  iconSize: [25, 36],
  iconAnchor: [12.5, 36],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  shadowAnchor: [12, 40]
};

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
  history,
  match
}) => {
  // Store references to the leaflet map
  const leafletRef = useRef<LeafletMap>({} as LeafletMap);
  const [map, setMap] = useState<LeafletElement>();
  useEffect(() => {
    setMap(leafletRef.current && leafletRef.current.leafletElement);
  }, []);
  // Set bounds to Oklahoma state wide
  // useEffect(() => {
  // if (map) {
  //   // console.log('map', map);
  //   map.fitBounds([
  //     [33.61919542, -103.00246156],
  //     [33.61919542, -94.43121924],
  //     [37.00229935, -94.43121924],
  //     [37.00229935, -103.00246156],
  //     [33.61919542, -103.00246156]
  //   ]);
  // }
  // }, [map]);

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

  // Get location from IP address and center to that location
  useEffect(() => {
    fetch('https://freegeoip.app/json/')
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        // If in oklahoma, center
        console.log('data', data);
        if (data.region_code === 'OK') {
          setMapZoom(12);
          setMapCenter([data.latitude, data.longitude]);
        }
      });
  }, []);

  const [shownLocationCount, setShownLocationCount] = useState(20);

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
            className={classnames('locations-list', { open: mobileListIsOpen && !locationIdParam })}
          >
            <div className="list-flex-wrapper">
              {/* Nearby search NOT for mobile */}
              <div className="desktop-search">
                <Input type="text" placeholder="Enter your address or Zip code" />
                <OpenNowFilter />
              </div>

              {/* Scroller for locations list */}
              <div id="list-scroll" className="list-scroll">
                <InfiniteScroll
                  scrollableTarget="list-scroll"
                  dataLength={shownLocationCount} //This is important field to render the next data
                  next={() => {
                    setShownLocationCount(shownLocationCount + 20);
                  }}
                  hasMore={shownLocationCount < locations.length}
                  loader={<div className="list-message">Loading...</div>}
                  endMessage={
                    <div className="list-message">Showing all {locations.length} locations</div>
                  }
                  initialScrollY={58} // Initiall scroll past filter/sort
                >
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
                  {locations.map(
                    (location, index) =>
                      index < shownLocationCount && (
                        <LocationItemLink key={location.id} location={location} />
                      )
                  )}
                </InfiniteScroll>
              </div>
            </div>
          </div>

          {/* Embedded map */}
          <LeafletMap
            className={classnames('map-embed', { narrow: locationIdParam })}
            center={mapCenter}
            zoom={mapZoom}
            animate={true}
            ref={leafletRef}
            // maxBounds={[[44.6856049, -118.8662969], [30.8917819, -84.2111817]]}
            // minZoom={5}
          >
            <TileLayer
              // access_token="pk.eyJ1IjoiY2RvZSIsImEiOiJjanVmeGRmaGowZjM3NDlucXNocmZyZmZrIn0.zW5aLSTzrHl5OAx4YF4ETA"
              // id="mapbox.streets"
              // url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}"
              // From CartoDB free map tiles: https://github.com/CartoDB/basemap-styles
              url={`https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}${
                retina ? '@2x' : ''
              }.png`}
              subdomains="abcd"
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
                    icon={new Leaflet.Icon(mapIcon)}
                    onClick={() => {
                      history.push('/locations/' + location.id);
                    }}
                  />
                );
              }
            })}
          </LeafletMap>
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
                <Icon icon="arrow_back_ios" /> Back
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
