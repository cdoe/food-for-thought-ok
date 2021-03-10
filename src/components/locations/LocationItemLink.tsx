// Core
import React, { FunctionComponent, AnchorHTMLAttributes, memo, Fragment } from 'react';
import Location from '../../types/location';
import { metersToRoundedMiles } from '../../lib/distanceHelpers';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
// Styles
import './LocationItemLink.scss';
import Icon from '../Icon';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import LocationStatus from './LocationStatus';
import ClampLines from 'react-clamp-lines';

// Component
const LocationItemLink: FunctionComponent<
  { location: Location } & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ location, ...rest }) => {
  const { t, i18n } = useTranslation();

  return (
    <Link
      to={`/locations/${location.id}`}
      className={classnames('LocationItemLink', location.status === 'after-end' && 'faded')}
      {...rest}
    >
      {/* Location Name */}
      <div className="name">
        {location.name}
        {/* Mobile Location tag */}
        {location.isMobile && (
          <>
            {' '}
            <span className="mobile-tag">
              <Icon icon="airport_shuttle" />
              Mobile
            </span>
          </>
        )}
      </div>

      {/* Address, Distance */}
      <div className="location">
        {location.address} · {location.city}
        {location.distance && ` · ${metersToRoundedMiles(location.distance)}mi`}
      </div>

      {/* Loction notes (added during covid) */}
      {!!location.notes && location.status !== 'after-end' && (
        <ClampLines
          text={location.notes}
          id="clamped-notes"
          lines={2}
          buttons={false}
          className="notes"
        />
      )}

      {/* Location status label and next/current meal */}
      <LocationStatus location={location} />

      {/* Meals served */}
      {location.status !== 'after-end' && (
        <Fragment>
          <div className="meals">
            <Icon icon="local_dining" />
            <span className={location.servesBreakfast ? 'active' : ''}>
              {t('locations.breakfast')}
            </span>
            <span className={location.servesLunch ? 'active' : ''}>{t('locations.lunch')}</span>
            <span className={location.servesSnack ? 'active' : ''}>{t('locations.snack')}</span>
            <span className={location.servesDinner ? 'active' : ''}>{t('locations.dinner')}</span>
          </div>

          {/* Weekdays served (localized) */}
          <div className="days">
            <Icon icon="event_available" />
            {/* Monday */}
            <span className={location.monday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 1 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
            {/* Tuesday */}
            <span className={location.tuesday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 2 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
            {/* Wednesday */}
            <span className={location.wednesday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 3 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
            {/* Thursday */}
            <span className={location.thursday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 4 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
            {/* Friday */}
            <span className={location.friday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 5 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
            {/* Saturday */}
            <span className={location.saturday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 6 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
            {/* Sunday */}
            <span className={location.sunday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 7 }).setLocale(i18n.language).toFormat('EEE')}
            </span>
          </div>
        </Fragment>
      )}
    </Link>
  );
};

export default memo(LocationItemLink);
