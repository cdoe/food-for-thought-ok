// Core
import { FC, useState, createContext, Dispatch, SetStateAction, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useSessionState from './hooks/useSessionState';
import useFetchedLocationsFromGSheets from './lib/fetchLocationsFromGSheets';
import AppRoutes from './AppRoutes';
import Leaflet from 'leaflet';
// Styles
import './styles/normalize.css';
import './styles/base.scss';
// Global Contexts
import CurrentUser, { defaultCurrentUser } from './types/currentUser';
import Location from './types/location';
export const CurrentUserCtx = createContext<[CurrentUser, Dispatch<SetStateAction<CurrentUser>>]>([
  defaultCurrentUser,
  () => {},
]);
export const MobileNavCtx = createContext<[boolean, any]>([false, () => {}]);
export const LocationsCtx = createContext<Location[]>([]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Make sure the Google Sheet's sharing settings are set to 'Anyone with the link can view' then update .env.local variables. //
// The individual sheetName is case-sensitive and must be exact. Note: this is NOT the same as the document title)            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
const sheetName =
  process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_GOOGLE_SHEET_NAME || '' // Should point to the 'Locations_dev' sheet
    : process.env.REACT_APP_GOOGLE_SHEET_NAME_DEV || ''; // Should point to the 'Locations_dev' sheet

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generate an API with access to the 'Google Sheets API' within the Google Cloud Console                   //
// and, for security, ensure application restrictions are set to HTTP referrers and necessary URLS are set  //
// https://console.cloud.google.com/apis/credentials                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || ''; // Restricted to meals4kidsok.org and dev environment

// Render very top-level App component
const App: FC = () => {
  // Global currentUser state
  const [currentUser, setCurrentUser] = useSessionState(defaultCurrentUser, 'current-user');

  // Detect if browser has geolocation
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setCurrentUser(currentUser => ({
        ...currentUser,
        hasGeoAccess: false,
      }));
    }
  }, [setCurrentUser]);

  // If doesn't have previous location, get location from IP address and center to that location via https://ip-api.com/
  // We could possibly look into a paid solution like https://ipbase.com/ or https://ipinfo.io/ or https://ipstack.com
  useEffect(() => {
    if (!currentUser.latLng) {
      // aync functions must be wrapped inside `useEffect`
      (async () => {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        // If in oklahoma, center to general area
        if (data.region === 'OK' && data.lat && data.lon) {
          setCurrentUser(currentUser => ({
            ...currentUser,
            latLng: [data.lat, data.lon],
            geoQuery: `${data.city}, ${data.region} ${data.zip}`,
            geoName: `${data.city}, ${data.region} ${data.zip}`,
          }));
        }
      })();
    }
  }, [currentUser.latLng, setCurrentUser]);

  // Locations
  // Fetched from Google Sheets, data transformed/formatted, and alphabetized
  const rawLocations = useFetchedLocationsFromGSheets({
    sheetId,
    sheetName,
    apiKey,
  });
  // Locations with calculated distance parameter added based on user's location
  const [measuredLocations, setMeasuredLocations] = useState(rawLocations);
  useEffect(() => {
    if (rawLocations.length > 0 && !!currentUser.latLng) {
      // Loop through and calculate distance from user's location
      setMeasuredLocations(
        rawLocations.map(location => {
          if (location.lat && location.lng) {
            const latLng = Leaflet.latLng([location.lat, location.lng]);
            location.distance = latLng.distanceTo(
              Leaflet.latLng(currentUser.latLng as [number, number])
            );
            return location;
          }
          return location;
        })
      );
    } else {
      // May not have current latLong, so update with newest raw data anyways
      setMeasuredLocations(rawLocations);
    }
  }, [rawLocations, currentUser.latLng]);

  // Global menu state
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);

  return (
    <CurrentUserCtx.Provider value={[currentUser, setCurrentUser]}>
      <LocationsCtx.Provider value={measuredLocations}>
        <MobileNavCtx.Provider value={[mobileNavIsOpen, setMobileNavIsOpen]}>
          <Router>
            <AppRoutes />
          </Router>
        </MobileNavCtx.Provider>
      </LocationsCtx.Provider>
    </CurrentUserCtx.Provider>
  );
};

export default App;
