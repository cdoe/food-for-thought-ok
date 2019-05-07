// Core
import React, {
  FunctionComponent,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Leaflet from 'leaflet';
import fetchLocationsFromGSheets from './lib/fetchLocationsFromGSheets';
// Global Contexts
import CurrentUser, { defaultCurrentUser } from './types/currentUser';
export const CurrentUserCtx = createContext<[CurrentUser, Dispatch<SetStateAction<CurrentUser>>]>([
  defaultCurrentUser,
  () => {}
]);
export const MobileNavCtx = createContext<[boolean, any]>([false, () => {}]);
import Location from './types/location';
export const LocationsCtx = createContext<Location[]>([]);
// Styles
import './styles/normalize.css';
import './styles/base.scss';
// Pages
import LandingPage from './pages/LandingPage';
import LocationsPage from './pages/LocationsPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import ListPage from './pages/ListPage';
import NondiscriminationPage, { NondiscriminationPageSpanish } from './pages/NondiscriminationPage';
// Layout Components
import PageWrapper from './layout/PageWrapper';
import PrimaryNav from './layout/PrimaryNav';
import MobileNav from './layout/MobileNav';
import useSessionState from './hooks/useSessionState';
import { useTranslation } from 'react-i18next';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Make sure the Google Sheet's sharing settings are set to 'Anyone with the link can view' then update .env.local variables. //
// The individual sheetName is case-sensitive and must be exact. Note: this is NOT the same as the document title)            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
const sheetName =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_GOOGLE_SHEET_NAME || '' // Should point to the 'Locations_dev' sheet
    : process.env.REACT_APP_GOOGLE_SHEET_NAME_DEV || ''; // Should point to the 'Locations_dev' sheet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generate an API with access to the 'Google Sheets API' within the Google Cloud Console                   //
// and, for security, ensure application restrictions are set to HTTP referrers and necessary URLS are set  //
// https://console.cloud.google.com/apis/credentials                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || ''; // Restricted to meals4kidsok.org and dev environment

// Render very top-level App component
const App: FunctionComponent = () => {
  // Global currentUser state
  const [currentUser, setCurrentUser] = useSessionState(defaultCurrentUser, 'current-user');

  // Detect if browser has geolocation
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setCurrentUser(currentUser => ({
        ...currentUser,
        hasGeoAccess: false
      }));
    }
  }, []);

  // If doesn't have previous location, get location from IP address and center to that location
  // https://freegeoip.app/ (may have arbitrary limit for free use)
  // We could possibly look into a paid solution like https://ipinfo.io/ or https://ipstack.com
  useEffect(() => {
    if (!currentUser.latLng) {
      fetch('https://freegeoip.app/json/')
        .then(resp => {
          return resp.json();
        })
        .then(data => {
          // If in oklahoma, center to general area
          console.log('data', data);
          if (data.region_code === 'OK' && data.latitude && data.longitude) {
            setCurrentUser(currentUser => ({
              ...currentUser,
              latLng: [data.latitude, data.longitude],
              geoQuery: `${data.city}, ${data.region_code} ${data.zip_code}`,
              geoName: `${data.city}, ${data.region_code} ${data.zip_code}`
            }));
          }
        });
    }
  }, []);

  // Locations
  // Fetched from Google Sheets, data transformed/formatted, and alphabetized
  const rawLocations = fetchLocationsFromGSheets({
    sheetId,
    sheetName,
    apiKey
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
    }
  }, [rawLocations, currentUser.latLng]);

  // Global menu state
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <CurrentUserCtx.Provider value={[currentUser, setCurrentUser]}>
      <LocationsCtx.Provider value={measuredLocations}>
        <MobileNavCtx.Provider value={[mobileNavIsOpen, setMobileNavIsOpen]}>
          <Router>
            <Switch>
              <PageWrapper>
                <PrimaryNav />
                <MobileNav />
                <Switch>
                  <Route path="/" exact component={LandingPage} />
                  <Route path="/locations/:locationId?" component={LocationsPage} />
                  <Route path="/faq" component={FaqPage} />
                  <Route path="/contact" component={ContactPage} />
                  <Route path="/list" component={ListPage} />
                  {t('footer.nondiscriminationLink') === '/nodiscriminacion' && (
                    <Redirect from="/nondiscrimination" to="/nodiscriminacion" />
                  )}
                  <Route path="/nondiscrimination" component={NondiscriminationPage} />
                  {t('footer.nondiscriminationLink') === '/nondiscrimination' && (
                    <Redirect from="/nodiscriminacion" to="/nondiscrimination" />
                  )}
                  <Route path="/nodiscriminacion" component={NondiscriminationPageSpanish} />
                  <Redirect path="/" to="/" />
                </Switch>
              </PageWrapper>
            </Switch>
          </Router>
        </MobileNavCtx.Provider>
      </LocationsCtx.Provider>
    </CurrentUserCtx.Provider>
  );
};

export default App;
