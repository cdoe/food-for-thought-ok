// Core
import React, { FunctionComponent, useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
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
import { string } from 'prop-types';
// Global Contexts
export const MobileNavCtx = createContext<[boolean, any]>([false, () => {}]);
export const LanguageCtx = createContext<[string, any]>(['en', () => {}]);

const App: FunctionComponent = () => {
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <MobileNavCtx.Provider value={[mobileNavIsOpen, setMobileNavIsOpen]}>
      <LanguageCtx.Provider value={[language, setLanguage]}>
        <Router>
          <Switch>
            <PageWrapper>
              <PrimaryNav />
              <MobileNav />
              <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/locations/" component={LocationsPage} />
                <Route path="/faq/" component={FaqPage} />
                <Route path="/contact/" component={ContactPage} />
                <Route path="/list/" component={ListPage} />
                <Route path="/nondiscrimination/" component={NondiscriminationPage} />
                <Route path="/" component={LandingPage} />
              </Switch>
            </PageWrapper>
          </Switch>
        </Router>
      </LanguageCtx.Provider>
      }
    </MobileNavCtx.Provider>
  );
};

export default App;
