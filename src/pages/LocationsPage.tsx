// Core
import React, {
  FunctionComponent,
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
// Mapping
import Leaflet from 'leaflet';
import { Map as LeafletMap, TileLayer, CircleMarker, Marker, Tooltip } from 'react-leaflet';
import { metersToRoundedMiles } from '../lib/distanceHelpers';
import Location from '../types/location';
// Data
import { CurrentUserCtx, LocationsCtx } from '../App';
import useThrottle from '../hooks/useThrottle';
// Styles
import './LocationsPage.scss';
// Components
import SearchAutocomplete from '../components/locations/SearchAutocomplete';
import MobileHeader from '../layout/MobileHeader';
import Input from '../components/Input';
import Icon from '../components/Icon';
import LocationItemLink from '../components/locations/LocationItemLink';
import LocationDetail from '../components/locations/LocationDetail';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../components/Loader';
// Images
import pinIcon from '../img/pin.png';
import retinaPinIcon from '../img/pin@2x.png';
import pinShadow from '../img/pin-shadow.png';
import currentLocationIcon from '../img/current-location.png';
import retinaCurrentLocationIcon from '../img/current-location@2x.png';
import LocationStatus from '../components/locations/LocationStatus';

const OpenNowFilter: FunctionComponent<{
  openNowFilter: boolean;
  setOpenNowFilter: Dispatch<SetStateAction<boolean>>;
}> = ({ openNowFilter, setOpenNowFilter }) => {
  const { t } = useTranslation();

  return (
    <div className="open-now-filter">
      <button
        className={openNowFilter ? '' : 'active'}
        onClick={e => {
          e.preventDefault();
          setOpenNowFilter(false);
        }}
      >
        {t('locations.allLocations')}
      </button>
      <button
        className={openNowFilter ? 'active' : ''}
        onClick={e => {
          e.preventDefault();
          setOpenNowFilter(true);
        }}
      >
        {t('locations.openNow')}
      </button>
    </div>
  );
};

// Map Positioning
//
// *There's handy tool to find map bounds @ https://boundingbox.klokantech.com/ just note...
// the GeoJson it spits out is [lng, lat] counterclockwise starting from lower-left bound
const maxBounds = Leaflet.latLngBounds(
  [5.621295739, -143.94000019],
  [56.8537668621, -54.2877861397]
);
// CENTRAL STATE
export const oklahomaBounds = Leaflet.latLngBounds(
  [33.61919542, -99.7839304345],
  [37.00229935, -94.4470640557]
);
// FULL STATE (unused for now)
// export const oklahomaBounds = Leaflet.latLngBounds(
//   [33.61919542, -103.00246156],
//   [37.00229935, -94.43121924]
// );
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
  shadowAnchor: [12, 40],
};
const currentLocationLeafletIcon: Leaflet.IconOptions = {
  iconUrl: currentLocationIcon,
  iconRetinaUrl: retinaCurrentLocationIcon,
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5],
};

// Component
const LocationsPage: FunctionComponent<RouteComponentProps<{ locationId?: string }>> = ({
  history,
  match,
}) => {
  const { t } = useTranslation();

  // currentUser (available app-wide context)
  ///////////////////////////////////////////
  const [currentUser, setCurrentUser] = useContext(CurrentUserCtx);

  // locations (available app-wide context)
  /////////////////////////////////////////
  const locations = useContext(LocationsCtx);
  const isLoading = locations.length === 0;

  // Filter for searching location names/cities
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const throttledFilterValue = useThrottle(filterValue, 200);
  const isFiltering = !!filterValue.trim();
  // List for alphabetical OR
  const [sortedLocations, setSortedLocations] = useState<Location[]>(locations);
  const [displayLocations, setDisplayLocations] = useState<Location[]>(locations);
  // Get locationId from URL (if exists)
  const locationId = match.params.locationId;
  // Stateful count to use in virtual scroller
  // (for better performance on 600 items in list)
  const [shownLocationCount, setShownLocationCount] = useState(20);

  // UI States
  ////////////
  const [initialLoad, setInitialLoad] = useState(true);
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

  // Establish map params
  ///////////////////////
  const [mapZoom, setMapZoom] = useState(currentUser.latLng ? 12 : defaultMapZoom);
  const [mapCenter, setMapCenter] = useState<Leaflet.LatLng>(
    currentUser.latLng ? Leaflet.latLng(currentUser.latLng) : oklahomaCenter
  );
  const [mapBounds, setMapBounds] = useState<Leaflet.LatLngBounds>(oklahomaBounds);
  // Store a set of bounds as a baseline for locations near them
  const [nearbyBounds, setNearbyBounds] = useState<Leaflet.LatLngBounds>(oklahomaBounds);
  const throttledNearbyBounds = useThrottle(nearbyBounds, 300);
  // Store a set of bounds that a user can return to after backing out of location details
  const [historyBounds, setHistoryBounds] = useState<Leaflet.LatLngBounds>();

  // Sort locations based on sortType from currentUser
  useEffect(() => {
    if (
      !isLoading &&
      currentUser.sortType === 'nearby' &&
      !!currentUser.latLng &&
      locations[0].distance
    ) {
      setSortedLocations(sortBy(locations, ['distance']));
    } else {
      setSortedLocations(locations);
    }
  }, [isLoading, locations, currentUser.latLng, currentUser.sortType]);

  // To show or hide locations based on 'open now' and
  // when user is typing in a location 'filter'
  useEffect(() => {
    let filteredLocations = sortedLocations;
    if (openNowFilter) {
      // XXX TODO
      // Restrict list to only those open (or opening soon)
      filteredLocations = sortedLocations.filter(location =>
        ['open-soon', 'open', 'closed-soon'].includes(location.status || '')
      );
    }
    if (!!throttledFilterValue.trim()) {
      // Filter subset of those that match name or city of typed in filter
      filteredLocations = filteredLocations.filter(location => {
        const nameMatch = location.name.toLowerCase().includes(throttledFilterValue.toLowerCase());
        const cityMatch =
          location.city && location.city.toLowerCase().includes(throttledFilterValue.toLowerCase());
        return nameMatch || cityMatch;
      });
    }
    // Set the list we end up seeing
    setDisplayLocations(filteredLocations);
  }, [sortedLocations, openNowFilter, throttledFilterValue]);

  // Effect triggered when locationId in URL changes
  useEffect(() => {
    // If location id is present in URL (and is valid location), set locationId state
    // and center map at that location
    if (!!locationId) {
      // Save current bounds to return to when backing out of location details
      // if not already set (meaning we're navigating from one location detail to another)
      // and not initial load, so we can back out to nearby bounds
      if (!initialLoad) {
        !historyBounds &&
          leafletRef.current &&
          setHistoryBounds(leafletRef.current.leafletElement.getBounds());
      } else {
        setInitialLoad(false);
      }
      // Find location in list with ID
      const location = locations.find(location => location.id === locationId);
      if (location && location.lat && location.lng) {
        const latLng = Leaflet.latLng([location.lat, location.lng]);
        // if user's location is set, set bounds to include both
        if (!!currentUser.latLng) {
          setMapBounds(Leaflet.latLngBounds([currentUser.latLng, latLng]).pad(0.5));
        } else {
          // if user's location isn't set, go ahead and just center around selected location
          setMapCenter(latLng);
          setMapZoom(12);
        }
      } else {
        // If couldn't find location, set map to default settings
        setMapBounds(oklahomaBounds);
      }
    } else {
      // If historyBounds are set when location is removed
      // return user to their previous bounds
      if (historyBounds) {
        setMapBounds(historyBounds);
        setHistoryBounds(undefined);
      } else {
        !initialLoad && setMapBounds(nearbyBounds);
      }
    }

    // If location is removed from url, collapse mobile details
    // so next time opened is defaulted to not expanded.
    // This mainly happens when pressing the back arrow in detail view on mobile.
    !locationId && setMobileDetailsExpanded(false);
  }, [currentUser.latLng, historyBounds, initialLoad, locationId, locations, nearbyBounds]);

  // Anytime locations or userLocation changes set nearbyNounds
  // to closest 15 locations within 15 miles, 5 locations minimum
  const compareDistance = (locations[0] && locations[0].distance) || 0;
  useEffect(() => {
    if (!!currentUser.latLng && !isLoading && locations[0].distance) {
      const distanceSortedLocations = sortBy(locations, ['distance']);
      if (distanceSortedLocations[0].lat && distanceSortedLocations[0].lng) {
        const nearestLatLng = Leaflet.latLng([
          distanceSortedLocations[0].lat,
          distanceSortedLocations[0].lng,
        ]);
        const nearbyBounds = Leaflet.latLngBounds(currentUser.latLng, nearestLatLng);
        for (let i = 1; i < 15; i++) {
          if (distanceSortedLocations[i]) {
            const lat = distanceSortedLocations[i].lat;
            const lng = distanceSortedLocations[i].lng;
            // Only include locations within 15miles (~24000meters)
            const distance = distanceSortedLocations[i].distance;
            if (lat && lng && distance && (distance < 24000 || i < 5)) {
              const latLng = Leaflet.latLng([lat, lng]);
              nearbyBounds.extend(latLng);
            }
          }
        }
        setMapBounds(nearbyBounds);
        setNearbyBounds(nearbyBounds); // For throttled value
      }
    }
  }, [compareDistance, currentUser.latLng, isLoading, locations]);
  // Set bounds to nearby with throttled value to avoid race conditions of sorting & setNearbyBounds
  // (but not if oklahoma bounds)
  useEffect(() => {
    if (!locationId && !nearbyBounds.equals(oklahomaBounds)) {
      setMapBounds(nearbyBounds);
    }
  }, [locationId, nearbyBounds, throttledNearbyBounds]);

  return (
    <Fragment>
      {/* Nearby search on mobile */}
      {/* and the OpenNowFilter only shows on mobile when location detail view isn't active */}
      <MobileHeader
        bottom={
          !!locationId ? undefined : (
            <OpenNowFilter openNowFilter={openNowFilter} setOpenNowFilter={setOpenNowFilter} />
          )
        }
      >
        <SearchAutocomplete history={history} redirectOnSuccess={!!locationId} />
      </MobileHeader>

      {/* Rest of the locations page */}
      <div className="LocationsPage">
        {/* Covid-19 - notice */}
        {/* <div className="notice">{t('locations.covidResponse')}</div> */}
        {/* More locations coming soon - notice */}
        {/* <div className="notice">{t('locations.moreSoon')}</div> */}
        {/* Some sites may close on July 4th - notice  */}
        {/* <div className="notice">{t('locations.julyFourthClosings')}</div> */}
        {/* Some sites may close on Good Friday - notice  */}
        {/* <div className="notice">{t('locations.goodFridayClosings')}</div> */}

        {/* Flex wrapper including embedded map and locations side bar */}
        <div className="list-and-map-wrapper">
          {/* Locations list side bar (formatted a little different on mobile) */}
          <div
            className={classnames('locations-list', {
              open: mobileListIsOpen && !locationId,
            })}
          >
            <div className="list-flex-wrapper">
              {/* Nearby search NOT for mobile */}
              <div className="desktop-search">
                <SearchAutocomplete history={history} />
                <OpenNowFilter openNowFilter={openNowFilter} setOpenNowFilter={setOpenNowFilter} />
              </div>

              {/* Loader (But not when filtering) */}
              {isLoading && <Loader />}

              {/* Scroller for locations list */}
              <div id="list-scroll" className="list-scroll">
                {!isLoading && (
                  <InfiniteScroll
                    scrollableTarget="list-scroll"
                    dataLength={shownLocationCount} //This is important field to render the next data
                    next={() => {
                      setShownLocationCount(shownLocationCount + 20);
                    }}
                    hasMore={shownLocationCount < displayLocations.length}
                    loader={<div className="list-message">Loading...</div>}
                    endMessage={
                      <div className="list-message">
                        {!isFiltering &&
                          (openNowFilter
                            ? t('locations.openNowCount', {
                                count: displayLocations.length,
                              })
                            : t('locations.showingLocationCount', {
                                count: displayLocations.length,
                              }))}
                        {isFiltering &&
                          t('locations.filterResultsCount', {
                            count: displayLocations.length,
                          })}
                      </div>
                    }
                    initialScrollY={54} // Initiall scroll past filter/sort
                  >
                    {/* Filter + sort locations  */}
                    <div className="filter-sort-locations">
                      {/* Filter by input */}
                      <div className="filter-wrapper">
                        <Icon icon="search" className="search-icon" />
                        <Input
                          placeholder={t('locations.filterLocations')}
                          value={filterValue}
                          onChange={e => {
                            setFilterValue(e.target.value);
                          }}
                        />
                        {isFiltering && (
                          <button
                            className="clear-btn"
                            onClick={e => {
                              e.preventDefault();
                              setFilterValue('');
                            }}
                          >
                            <Icon icon="clear" />
                          </button>
                        )}
                      </div>
                      {/* Sort select (when has user location and isn't filtering) */}
                      {!!currentUser.latLng && !isFiltering && (
                        <div className="sort-wrapper">
                          <select
                            value={currentUser.sortType}
                            onChange={e => {
                              setCurrentUser(currentUser => ({
                                ...currentUser,
                                sortType: e.target.value as 'nearby' | 'name',
                              }));
                            }}
                          >
                            <option value="nearby">{t('locations.sortNearby')}</option>
                            <option value="name">{t('locations.sortName')}</option>
                          </select>
                          <Icon icon="arrow_drop_down" className="dropdown-icon" />
                        </div>
                      )}
                    </div>

                    {/* Locations list */}
                    {displayLocations.map(
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
                )}
              </div>
            </div>
          </div>

          {/* Embedded map */}
          <LeafletMap
            animate={true}
            className={classnames('map-embed', { narrow: locationId })}
            ref={leafletRef}
            // These stateful vars allow the map to animate dynamically
            zoom={mapZoom}
            center={mapCenter}
            bounds={mapBounds}
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
            {!!currentUser.latLng && (
              <Marker
                position={currentUser.latLng}
                icon={Leaflet.icon(currentLocationLeafletIcon)}
              />
            )}
            {/* All location markers */}
            {displayLocations.map(location => {
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
                    color={
                      ['open-soon', 'open', 'closed-soon'].includes(location.status || '')
                        ? '#c10f78'
                        : '#780353'
                    }
                    weight={locationId ? 5 : 1}
                    opacity={locationId || hoverLocationId ? 0.0001 : 1}
                    fillColor={
                      ['open-soon', 'open', 'closed-soon'].includes(location.status || '')
                        ? '#da1884'
                        : '#9d0867'
                    }
                    fillOpacity={locationId || hoverLocationId ? 0.3 : 0.8}
                    onClick={() => {
                      history.push('/locations/' + location.id);
                    }}
                    bubblingMouseEvents={false}
                  >
                    <Tooltip className="location-tooltip" opacity={1}>
                      <div className="name">{location.name}</div>
                      <LocationStatus location={location} small />
                      {location.distance && (
                        <div className="distance">
                          {t('locations.distanceCount', {
                            count: metersToRoundedMiles(location.distance),
                          })}
                        </div>
                      )}
                    </Tooltip>
                  </CircleMarker>
                );
              }
              return null;
            })}
          </LeafletMap>
          {/* Location detail panel */}
          <div
            className={classnames('location-detail-panel', {
              open: !!locationId,
              expanded: mobileDetailsExpanded,
            })}
          >
            {/* Back arrow (but don't show on mobile expanded) */}
            {!mobileDetailsExpanded && (
              <Link to="/locations/" className="back-link">
                <Icon icon="arrow_back_ios" /> {t('locations.back')}
              </Link>
            )}
            <LocationDetail
              location={locations.find(location => location.id === locationId)}
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
              <IconText icon="map" text={t('locations.showMap')} />
            ) : (
              <IconText icon="list" text={t('locations.showList')} />
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
              <IconText icon="expand_more" text={t('locations.showLess')} />
            ) : (
              <IconText icon="expand_less" text={t('locations.showMore')} />
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
