// Core
import React, { FunctionComponent, useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Location from './types/location';
// Hooks
import useLocationsFromGSheet from './hooks/useLocationsFromGSheet';
// Global Contexts
export const MobileNavCtx = createContext<[boolean, any]>([false, () => {}]);
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
import NondiscriminationPage from './pages/NondiscriminationPage';
// Layout Components
import PageWrapper from './layout/PageWrapper';
import PrimaryNav from './layout/PrimaryNav';
import MobileNav from './layout/MobileNav';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Make sure the Google Sheet's sharing settings are set to 'Anyone with the link can view' then update .env.local variables. //
// The individual sheetName is case-sensitive and must be exact. Note: this is NOT the same as the document title)            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const googleSheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
const sheetName =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_GOOGLE_SHEET_NAME || '' // Should point to the 'Locations_dev' sheet
    : process.env.REACT_APP_GOOGLE_SHEET_NAME_DEV || ''; // Should point to the 'Locations_dev' sheet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generate an API with access to the 'Google Sheets API' within the Google Cloud Console                   //
// and, for security, ensure application restrictions are set to HTTP referrers and necessary URLS are set  //
// https://console.cloud.google.com/apis/credentials                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const googleApiKey =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_GOOGLE_API_KEY || '' // Restricted to meals4kidsok.org
    : process.env.REACT_APP_GOOGLE_API_KEY_DEV || ''; // Restricted to localhost:3000

// Render very top-level App component
const App: FunctionComponent = () => {
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);

  return (
    <LocationsCtx.Provider value={useLocationsFromGSheet(googleSheetId, sheetName, googleApiKey)}>
      <MobileNavCtx.Provider value={[mobileNavIsOpen, setMobileNavIsOpen]}>
        <Router>
          <Switch>
            <PageWrapper>
              <PrimaryNav />
              <MobileNav />
              <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/locations/:locationId?" component={LocationsPage} />
                <Route path="/faq/" component={FaqPage} />
                <Route path="/contact/" component={ContactPage} />
                <Route path="/list/" component={ListPage} />
                <Route path="/nondiscrimination/" component={NondiscriminationPage} />
                <Route path="/" component={LandingPage} />
              </Switch>
            </PageWrapper>
          </Switch>
        </Router>
      </MobileNavCtx.Provider>
    </LocationsCtx.Provider>
  );
};

export default App;
