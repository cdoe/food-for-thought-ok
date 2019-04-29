// Core
import React, {
  FunctionComponent,
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
  ChangeEvent
} from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Leaflet from 'leaflet';
import { Map as LeafletMap, TileLayer, CircleMarker, Marker, Tooltip } from 'react-leaflet';
import { LocationsCtx } from '../App';
import { sortBy } from 'lodash';
import useSessionState from '../hooks/useSessionState';
import { metersToRoundedMiles } from '../lib/distanceHelpers';
// Types
import Location from '../types/location';
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
import pinIcon from '../img/pin.png';
import retinaPinIcon from '../img/pin@2x.png';
import pinShadow from '../img/pin-shadow.png';
import currentLocationIcon from '../img/current-location.png';
import retinaCurrentLocationIcon from '../img/current-location@2x.png';
import useLocalState from '../hooks/useLocalState';

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

// Map Positioning
//
// *There's handy tool to find map bounds @  https://boundingbox.klokantech.com/ just note...
// the GeoJson it spits out is [lng, lat] counterclockwise starting from lower-left bound
const maxBounds = Leaflet.latLngBounds(
  [45.6624166281, -118.5708519356],
  [23.1320065802, -78.7934776681]
);
const oklahomaBounds = Leaflet.latLngBounds(
  [37.00229935, -103.00246156],
  [33.61919542, -94.43121924]
);
const oklahomaCenter = oklahomaBounds.getCenter();
const defaultMapZoom = 7;
// Map icon settings
const PinLeafletIcon: Leaflet.IconOptions = {
  iconUrl: pinIcon,
  iconRetinaUrl: retinaPinIcon,
  iconSize: [25, 36],
  iconAnchor: [12.5, 36],
  shadowUrl: pinShadow,
  shadowSize: [41, 41],
  shadowAnchor: [12, 40]
};
const currentLocationLeafletIcon: Leaflet.IconOptions = {
  iconUrl: currentLocationIcon,
  iconRetinaUrl: retinaCurrentLocationIcon,
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5]
};

// Component
const LocationsPage: FunctionComponent<RouteComponentProps<{ locationId?: string }>> = ({
  history,
  match
}) => {
  // Fetch locations list from app-wide context
  const locations = useContext(LocationsCtx);
  const [sortedLocations, setSortedLocations] = useState<Location[]>([]);
  const [searchValue, setSearchValue] = useSessionState('', 'search-value');

  // Get locationId from URL (if exists)
  const locationId = match.params.locationId;

  // Stateful count to use in virtual scroller
  // (for better performance on 600 items in list)
  const [shownLocationCount, setShownLocationCount] = useState(20);
  // Mobile list and details states
  const [mobileListIsOpen, setMobileListIsOpen] = useState(false);
  const [mobileDetailsExpanded, setMobileDetailsExpanded] = useState(false);
  // Store hover location to swap pin out
  const [hoverLocationId, setHoverLocationId] = useState('');

  // Determine if screen is retina (to display retina pin graphics)
  const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2;
  // Determine if device is touch capable
  // so we can disable some hover effects preventing double tap on mobile
  const isTouchDevice = 'ontouchstart' in document.documentElement ? true : false;

  // Store references to the leaflet map
  const leafletRef = useRef<LeafletMap>({} as LeafletMap);
  // const [map, setMap] = useState<Leaflet.Map>();
  // useEffect(() => {
  //   leafletRef.current && setMap(leafletRef.current.leafletElement);
  // }, []);

  // Establish map params
  const [mapZoom, setMapZoom] = useState(defaultMapZoom);
  const [mapCenter, setMapCenter] = useState<Leaflet.LatLng>(oklahomaCenter);
  const [mapBounds, setMapBounds] = useState<Leaflet.LatLngBounds>(oklahomaBounds);
  const [userLocation, setUserLocation] = useState<Leaflet.LatLng>();
  // Store a set of bounds that a user can return to after backing out of location details
  const [historyBounds, setHistoryBounds] = useState<Leaflet.LatLngBounds>();

  // Sort locations by distance
  useEffect(() => {
    // Loop through and calculate distance from user's location
    if (userLocation) {
      locations.map(location => {
        if (location.lat && location.lng) {
          const latLng = Leaflet.latLng([location.lat, location.lng]);
          location.distance = latLng.distanceTo(userLocation);
          return location;
        }
        return location;
      });
    }
    // Set sorted array
    const distanceSortedLocations = sortBy(locations, ['distance']);
    setSortedLocations(distanceSortedLocations);

    // Anytime locations or userLocation changes
    // set map bounds to closest 10 locations
    if (userLocation && distanceSortedLocations[0].lat && distanceSortedLocations[0].lng) {
      const nearestLatLng = Leaflet.latLng([
        distanceSortedLocations[0].lat,
        distanceSortedLocations[0].lng
      ]);
      const nearbyBounds = Leaflet.latLngBounds(userLocation, nearestLatLng);
      for (let i = 1; i < 15; i++) {
        const lat = distanceSortedLocations[i].lat;
        const lng = distanceSortedLocations[i].lng;
        // Only include locations within 5miles (~8000meters)
        const distance = distanceSortedLocations[i].distance;
        if (lat && lng && distance && distance < 8046.72) {
          const latLng = Leaflet.latLng([lat, lng]);
          nearbyBounds.extend(latLng);
        }
      }
      setMapBounds(nearbyBounds);
    }
  }, [locations, userLocation]);

  // Get location from IP address and center to that location
  useEffect(() => {
    fetch('https://freegeoip.app/json/')
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        // If in oklahoma, center to general area
        console.log('data', data);
        if (data.region_code === 'OK') {
          setMapZoom(12);
          const lat = data.latitude;
          const lng = data.longitude;
          setMapCenter(Leaflet.latLng({ lat, lng }));
          setUserLocation(Leaflet.latLng([lat, lng]));
          setSearchValue(`${data.city}, ${data.region_code} ${data.zip_code}`);
        }
      });
  }, []);

  // Effect triggered when locationId in URL changes
  useEffect(() => {
    // If location id is present in URL (and is valid location), set locationId state
    // and center map at that location
    if (!!locationId) {
      // Save current bounds to return to when backing out of location details
      // if not already set (meaning we're navigating from one location detail to another)
      !historyBounds &&
        leafletRef.current &&
        setHistoryBounds(leafletRef.current.leafletElement.getBounds());

      const location = locations.find(location => location.id === locationId);
      if (location && location.lat && location.lng) {
        const latLng = Leaflet.latLng([location.lat, location.lng]);
        // if user's location is set, set bounds to include both
        if (userLocation) {
          setMapBounds(Leaflet.latLngBounds([userLocation, latLng]));
        } else {
          // if user's location isn't set, go ahead and just center around selected location
          setMapCenter(latLng);
          setMapZoom(12);
        }
      } else {
        // If couldn't find location, set map to default settings
        setMapBounds(oklahomaBounds);
      }
    }

    // If historyBounds are set when location is removed
    // return user to their previous bounds
    if (!locationId && historyBounds) {
      setMapBounds(historyBounds);
      setHistoryBounds(undefined);
    }

    // If location is removed from url, collapse mobile details
    // so next time opened is defaulted to not expanded.
    // This mainly happens when pressing the back arrow in detail view on mobile.
    !locationId && setMobileDetailsExpanded(false);
  }, [locationId]);

  return (
    <Fragment>
      {/* Nearby search on mobile */}
      {/* and the OpenNowFilter only shows on mobile when location detail view isn't active */}
      <MobileHeader bottom={!!locationId ? undefined : <OpenNowFilter />}>
        {/* <MobileHeader> */}
        <Input type="text" placeholder="Enter your address or Zip code" />
      </MobileHeader>

      {/* Rest of the locations page */}
      <div className="LocationsPage">
        {/* Flex wrapper including embedded map and locations side bar */}
        <div className="list-and-map-wrapper">
          {/* Locations list side bar (formatted a little different on mobile) */}
          <div className={classnames('locations-list', { open: mobileListIsOpen && !locationId })}>
            <div className="list-flex-wrapper">
              {/* Nearby search NOT for mobile */}
              <div className="desktop-search">
                <Input
                  type="text"
                  placeholder="Enter your address or Zip code"
                  value={searchValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearchValue(e.target.value);
                  }}
                />
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
                  hasMore={shownLocationCount < sortedLocations.length}
                  loader={<div className="list-message">Loading...</div>}
                  endMessage={
                    <div className="list-message">
                      Showing all {sortedLocations.length} locations
                    </div>
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
                  {sortedLocations.map(
                    (location, index) =>
                      index < shownLocationCount && (
                        <LocationItemLink
                          key={location.id}
                          location={location}
                          onMouseEnter={
                            // This song and dance prevents double tap on some mobile devices
                            isTouchDevice
                              ? undefined
                              : () => {
                                  setHoverLocationId(location.id);
                                }
                          }
                          onMouseLeave={
                            // This song and dance prevents double tap on some mobile devices
                            isTouchDevice
                              ? undefined
                              : () => {
                                  setHoverLocationId('');
                                }
                          }
                        />
                      )
                  )}
                </InfiniteScroll>
              </div>
            </div>
          </div>

          {/* Embedded map */}
          <LeafletMap
            animate={true}
            className={classnames('map-embed', { narrow: locationId })}
            ref={leafletRef}
            // These stateful vars allow the map to animate dynamically
            bounds={mapBounds}
            center={mapCenter}
            zoom={mapZoom}
            // roughly limit map bounds to Oklahoma
            maxBounds={maxBounds}
            minZoom={5}
            // Clear location when not clicking on pin
            onclick={() => {
              if (locationId) {
                history.push('/locations/');
              }
            }}
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
            {/* Current Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={Leaflet.icon(currentLocationLeafletIcon)} />
            )}
            {sortedLocations.map(location => {
              if (location.lat && location.lng) {
                const latLng = Leaflet.latLng([location.lat, location.lng]);
                return locationId === location.id || hoverLocationId === location.id ? (
                  // Selected... or hovered list item... marker (pin)
                  <Marker
                    key={location.id}
                    position={latLng}
                    icon={Leaflet.icon(PinLeafletIcon)}
                    onClick={() => {
                      // This is only to prevent bubbling up to map
                      // so location doesn't clear when tapping selected location pin
                    }}
                  />
                ) : (
                  // Unselected marker (circle)
                  <CircleMarker
                    key={location.id}
                    center={latLng}
                    radius={locationId ? 6 : 8}
                    color="#c10f78"
                    weight={locationId ? 5 : 1}
                    opacity={locationId || hoverLocationId ? 0.0001 : 1}
                    fillColor={hoverLocationId ? '#ed589a' : '#da1884'}
                    fillOpacity={locationId || hoverLocationId ? 0.3 : 0.8}
                    onClick={() => {
                      history.push('/locations/' + location.id);
                    }}
                    bubblingMouseEvents={false}
                  >
                    <Tooltip className="location-tooltip" opacity={1}>
                      {location.name}
                      {location.distance && (
                        <div className="distance">
                          {metersToRoundedMiles(location.distance)} miles away
                        </div>
                      )}
                    </Tooltip>
                  </CircleMarker>
                );
              }
            })}
          </LeafletMap>
          {/* Location detail panel */}
          <div
            className={classnames('location-detail-panel', {
              open: !!locationId,
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
              location={sortedLocations.find(location => location.id === locationId)}
              mobileExpanded={mobileDetailsExpanded}
            />
          </div>
        </div>

        {/* Mobile toggler for map vs. list (if not in detail view) */}
        {!locationId && (
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
        {!!locationId && (
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
