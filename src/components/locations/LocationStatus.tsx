// Core
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { timeStringToDateTime } from '../../lib/dateTimeHelpers';
import Location from '../../types/location';
// Styles
import './LocationStatus.scss';
import classnames from 'classnames';

// Component
const LocationStatus: FunctionComponent<{
  location: Location;
  small?: boolean;
  large?: boolean;
  lineWrapped?: boolean;
}> = ({ location, small, large, lineWrapped }) => {
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
      return timeStringToDateTime(timeString).setLocale(i18n.language).toFormat('t');
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
    <div
      className={classnames(
        'LocationStatus',
        small && 'small',
        large && 'large',
        lineWrapped && 'line-wrapped'
      )}
    >
      {/* Status and next/current meal */}
      {isWithinDateRange && (
        <div className="status">
          {/* Status label chip */}
          <span className={classnames('label', status)}>{statusText}</span>

          {/* If open-soon, meal starting at time */}
          {/* If open, meal until time */}
          {isOpenOrOpenSoon && (
            <span className="meal-context">
              {currentMeal} {startingAtOrUntil} {formatTime(location.currentMealUntil)}
            </span>
          )}

          {/* If closed, show next start time */}
          {status === 'closed' && (
            <span className="meal-context">{formatNextMeal(location.nextMealDate)}</span>
          )}
        </div>
      )}

      {/* Start Date */}
      {status === 'before-start' && (
        <div className="meals-begin-end">
          {t('locations.mealsBegin')}{' '}
          {DateTime.fromJSDate(location.startDate).setLocale(i18n.language).toFormat('MMM d')}
        </div>
      )}

      {/* Ended Date (possibly null since covid) */}
      {status === 'after-end' && !!location.endDate && (
        <div className="meals-begin-end">
          {t('locations.mealsEnded')}{' '}
          {DateTime.fromJSDate(location.endDate).setLocale(i18n.language).toFormat('MMM d')}
        </div>
      )}
    </div>
  );
};

export default LocationStatus;
