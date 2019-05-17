// Core
import React, { FunctionComponent, memo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// Styles
import './styles/normalize.css';
import './styles/base.scss';
// Pages
import LandingPage from './pages/LandingPage';
import LocationsPage from './pages/LocationsPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import ListPage from './pages/ListPage';
import NondiscriminationPage, {
  NondiscriminationPageSpanish
} from './pages/NondiscriminationPage';
// Layout Components
import PageWrapper from './layout/PageWrapper';
import PrimaryNav from './layout/PrimaryNav';
import MobileNav from './layout/MobileNav';
import { useTranslation } from 'react-i18next';
import withGaTracker from './lib/withGaTracker';

// Render very top-level App component
const AppRoutes: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Switch>
      <PageWrapper>
        <PrimaryNav />
        <MobileNav />
        <Switch>
          <Route path="/" exact component={withGaTracker(LandingPage)} />
          <Route
            path="/locations/:locationId?"
            component={withGaTracker(LocationsPage)}
          />
          <Route path="/faq" component={withGaTracker(FaqPage)} />
          <Route path="/contact" component={withGaTracker(ContactPage)} />
          <Route path="/list" component={withGaTracker(ListPage)} />
          {t('footer.nondiscriminationLink') === '/nodiscriminacion' && (
            <Redirect from="/nondiscrimination" to="/nodiscriminacion" />
          )}
          <Route
            path="/nondiscrimination"
            component={withGaTracker(NondiscriminationPage)}
          />
          {t('footer.nondiscriminationLink') === '/nondiscrimination' && (
            <Redirect from="/nodiscriminacion" to="/nondiscrimination" />
          )}
          <Route
            path="/nodiscriminacion"
            component={withGaTracker(NondiscriminationPageSpanish)}
          />
          <Redirect path="/" to="/" />
        </Switch>
      </PageWrapper>
    </Switch>
  );
};

export default memo(AppRoutes);
