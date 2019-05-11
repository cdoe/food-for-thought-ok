// Core
import React, { FunctionComponent, AnchorHTMLAttributes, memo, Fragment } from 'react';
import Location from '../../types/location';
import { metersToRoundedMiles } from '../../lib/distanceHelpers';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { timeStringToDateTime } from '../../lib/dateTimeHelpers';
// Styles
import './LocationItemLink.scss';
import Icon from '../Icon';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

// Component
const LocationItemLink: FunctionComponent<
  { location: Location } & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ location, ...rest }) => {
  const { t, i18n } = useTranslation();

  // Status helpers
  const status = location.status;
  const statusText = t(`locations.status.${location.status}`);
  const isWithinDateRange = !['before-start', 'after-end'].includes(status);
  const isOpenOrOpenSoon = ['open-soon', 'open', 'closed-soon'].includes(status);
  const currentMeal = location.currentMeal ? t('locations.' + location.currentMeal) : '';
  const startingAtOrUntil =
    status === 'open-soon' ? t('locations.startingAt') : t('locations.until');

  const formatTime = (timeString: string | null) => {
    if (timeString) {
      return timeStringToDateTime(timeString)
        .setLocale(i18n.language)
        .toFormat('t');
    }
    return '';
  };

  const formatNextMeal = (date: Date | null) => {
    if (date) {
      let displayString = t('locations.nextMeal') + ' ';
      const nextMeal = DateTime.fromJSDate(date).setLocale(i18n.language);
      const now = DateTime.local();
      // Add weekday name (or 'tomorrow') if not today
      if (!now.hasSame(nextMeal, 'day')) {
        if (now.plus({ day: 1 }).hasSame(nextMeal, 'day')) {
          // Tomorrow
          displayString += t('locations.tomorrow') + ' ';
        } else {
          // Other day of week
          displayString += nextMeal.toFormat('EEE') + ' ';
        }
      }
      displayString += 'at ' + nextMeal.toFormat('t');
      return displayString;
    }
    return '';
  };

  return (
    <Link
      to={`/locations/${location.id}`}
      className={classnames('LocationItemLink', status === 'after-end' && 'faded')}
      {...rest}
    >
      {/* Location Name */}
      <div className="name">{location.name}</div>

      {/* Address, Distance */}
      <div className="location">
        {location.address} · {location.city}
        {location.distance && ` · ${metersToRoundedMiles(location.distance)}mi`}
      </div>

      {/* Status or Start/End Date */}
      {isWithinDateRange && (
        <div className="status">
          {/* Status label chip */}
          <span className={classnames('label', status)}>{statusText}</span>
          {/* If open-soon, meal starting at time */}
          {/* If open, meal until time */}
          {isOpenOrOpenSoon &&
            `${currentMeal} ${startingAtOrUntil} ${formatTime(location.currentMealUntil)}`}

          {/* If closed, show next start time */}
          {status === 'closed' && formatNextMeal(location.nextMealDate)}
          {/* {status === 'closed' &&
            location.nextMealDate &&
            t('locations.nextMeal') +
              ' ' +
              DateTime.fromJSDate(location.nextMealDate)
                .setLocale(i18n.language)
                .toFormat('EEE t')} */}
        </div>
      )}
      {/* Start Date */}
      {status === 'before-start' && (
        <div className="meals-begin-end">
          {t('locations.mealsBegin')}{' '}
          {DateTime.fromJSDate(location.startDate)
            .setLocale(i18n.language)
            .toFormat('MMM M')}
        </div>
      )}
      {/* Ended Date */}
      {status === 'after-end' && (
        <div className="meals-begin-end">
          {t('locations.mealsEnded')}{' '}
          {DateTime.fromJSDate(location.endDate)
            .setLocale(i18n.language)
            .toFormat('MMM M')}
        </div>
      )}

      {/* Meals served */}
      {status !== 'after-end' && (
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
              {DateTime.fromObject({ weekday: 1 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
            {/* Tuesday */}
            <span className={location.tuesday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 2 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
            {/* Wednesday */}
            <span className={location.wednesday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 3 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
            {/* Thursday */}
            <span className={location.thursday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 4 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
            {/* Friday */}
            <span className={location.friday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 5 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
            {/* Saturday */}
            <span className={location.saturday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 6 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
            {/* Sunday */}
            <span className={location.sunday ? 'active' : ''}>
              {DateTime.fromObject({ weekday: 7 })
                .setLocale(i18n.language)
                .toFormat('EEE')}
            </span>
          </div>
        </Fragment>
      )}
    </Link>
  );
};

export default memo(LocationItemLink);
