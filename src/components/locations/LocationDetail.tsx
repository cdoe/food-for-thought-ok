// Core
import React, { FunctionComponent, HtmlHTMLAttributes, Fragment, memo } from 'react';
import Location from '../../types/location';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { useTranslation, Trans } from 'react-i18next';
import { compact } from 'lodash';
import ReactGA from 'react-ga';
// import NumberFormat from 'react-number-format';
// Styles
import './LocationDetail.scss';
import Icon from '../Icon';
import LocationStatus from './LocationStatus';
import { DateTime } from 'luxon';
import { timeStringToDateTime } from '../../lib/dateTimeHelpers';
import { metersToRoundedMiles } from '../../lib/distanceHelpers';

// Component
const LocationDetail: FunctionComponent<
  { location?: Location; mobileExpanded?: boolean } & HtmlHTMLAttributes<HTMLDivElement>
> = ({ location, mobileExpanded = false, ...rest }) => {
  const { t, i18n } = useTranslation();

  // Text notifications not yet wired up
  // const [phoneValue, setPhoneValue] = useState('');
  // const [formattedPhoneValue, setFormattedPhoneValue] = useState('');

  // Meal/Days helpers
  const activeMeals = location
    ? compact([
        location.servesBreakfast && 'breakfast',
        location.servesLunch && 'lunch',
        location.servesSnack && 'snack',
        location.servesDinner && 'dinner'
      ])
    : [];

  const formatTime = (timeString: string | null) => {
    if (timeString) {
      return timeStringToDateTime(timeString)
        .setLocale(i18n.language)
        .toFormat('t');
    }
    return '';
  };

  const formatWeekday = (weekday: number) => {
    return DateTime.fromObject({ weekday })
      .setLocale(i18n.language)
      .toFormat('EEEE');
  };

  const activeWeekdays = location
    ? compact([
        location.monday && formatWeekday(1),
        location.tuesday && formatWeekday(2),
        location.wednesday && formatWeekday(3),
        location.thursday && formatWeekday(4),
        location.friday && formatWeekday(5),
        location.saturday && formatWeekday(6),
        location.sunday && formatWeekday(7)
      ])
    : [];

  const locationUrl = location ? 'https://meals4kidsok.org/locations/' + location.id : '';

  return (
    <div className="LocationDetail" {...rest}>
      {location && (
        <Fragment>
          {/* Add new title/metadata to head for this location */}
          {!!location && (
            <Helmet>
              <title>Food for Thought Oklahoma - {location.name}</title>
            </Helmet>
          )}
          {/* Above the fold on mobile */}
          {/* Location Name */}
          <div className="name">{location.name}</div>
          {/* Status */}
          <LocationStatus location={location} lineWrapped large />

          {/* Below the fold on mobile */}
          <div
            className={classnames('mobile-expander', {
              expanded: mobileExpanded
            })}
          >
            {/* Mealtimes, Weekdays, and End Date (if not past end-date) */}
            {location.status !== 'after-end' && (
              <Fragment>
                <div className="wavy-line-divider" />

                {/* Meals and days served block */}
                <div className="schedule-wrapper">
                  {/* Meals served */}
                  <div className="cell meals">
                    {/* Count meals */}
                    <div className="summary">
                      {t('locations.mealsCount', {
                        count: activeMeals.length
                      })}
                    </div>
                    {/* List meals and time */}
                    {activeMeals.map(meal => {
                      return (
                        <Fragment key={meal}>
                          <div className="meal">{t('locations.' + meal)}</div>
                          <div className="time">
                            {/* 
                            // @ts-ignore */}
                            {formatTime(location[meal + 'Start'])} -{' '}
                            {/* 
                            // @ts-ignore */}
                            {location[meal + 'End']}
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                  {/* Weekdays served */}
                  <div className="cell days">
                    {/* Count weekdays*/}
                    <div className="summary">
                      {t('locations.weekdaysCount', {
                        count: activeWeekdays.length
                      })}
                    </div>
                    {/* List weekdays */}
                    {activeWeekdays.map(weekday => {
                      return (
                        <div key={weekday} className="day">
                          {weekday}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* End date */}
                <div className="start-end-date">
                  {t('locations.mealsEnd')}{' '}
                  <span className="date">
                    {DateTime.fromJSDate(location.endDate)
                      .setLocale(i18n.language)
                      .toFormat('MMM d')}
                  </span>
                </div>
                <div className="wavy-line-divider" />
              </Fragment>
            )}

            {/* Text notification not completed at this time... */}
            {/* <div className="text-notifications">
              <div className="header">
                <Icon icon="phonelink_ring" /> Text notifications
              </div>
              <div className="form">
                <NumberFormat
                  className="input"
                  placeholder="(___) ___-____"
                  format="(###) ###-####"
                  mask="_"
                  type="tel"
                  value={formattedPhoneValue}
                  onValueChange={values => {
                    const { formattedValue, value } = values;
                    setFormattedPhoneValue(formattedValue);
                    setPhoneValue(value);
                  }}
                />
                <button className="submit-phone-btn" disabled={phoneValue.length < 10}>
                  Submit
                </button>
              </div>
              <div className="description">
                Enter your phone number to receive text notifications 30 minutes before meals are
                served at this location.
              </div>
              <div className="disclaimer">*Standard messaging rates apply.</div>
            </div> */}

            {/* Address, Distance, Directions */}
            <div className="location">
              <div className="address">{location.address}</div>
              <div className="city">{location.city}, OK</div>
              {location.distance && (
                <div className="distance">
                  {t('locations.distanceCount', {
                    count: metersToRoundedMiles(location.distance)
                  })}
                </div>
              )}
              <a
                href={
                  'https://www.google.com/maps/dir/?api=1&destination=' +
                  encodeURIComponent(`${location.name}, ${location.address}, ${location.city}, OK`)
                }
                className="directions-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="directions" /> {t('locations.getDirections')}
              </a>
            </div>

            {/* Phone */}
            {location.phone && (
              <div className="contact-phone">
                <a
                  className="phone-link"
                  href={
                    'tel:' + location.phone + (location.phoneExt ? ',' + location.phoneExt : '')
                  }
                >
                  <Icon icon="phone" /> {location.phone}
                  {location.phoneExt && ' ext.' + location.phoneExt}
                </a>
              </div>
            )}

            {/* Social */}
            {!!locationUrl.trim() && (
              <div className="sharing">
                {/* Facebook */}
                <a
                  href={'https://www.facebook.com/sharer/sharer.php?u=' + locationUrl}
                  onClick={() => {
                    ReactGA.event({
                      category: 'Social',
                      action: 'Shared location on Facebook'
                    });
                  }}
                >
                  <Icon icon="thumb_up" />{' '}
                  <Trans i18nKey="locations.shareFacebook">
                    Share this location on <strong>Facebook</strong>
                  </Trans>
                </a>
                {/* Text message */}
                <a
                  href={'sms:?&body=' + t('locations.shareBody') + ' ' + locationUrl}
                  onClick={() => {
                    ReactGA.event({
                      category: 'Social',
                      action: 'Shared location by SMS'
                    });
                  }}
                >
                  <Icon icon="message" />{' '}
                  <Trans i18nKey="locations.shareSms">
                    Share this location by <strong>text message</strong>
                  </Trans>
                </a>
                {/* Email */}
                <a
                  href={
                    'mailto:?subject=' +
                    t('locations.shareSubject') +
                    '!&body=' +
                    t('locations.shareBody') +
                    ' ' +
                    locationUrl
                  }
                  onClick={() => {
                    ReactGA.event({
                      category: 'Social',
                      action: 'Shared location by email'
                    });
                  }}
                >
                  <Icon icon="email" />{' '}
                  <Trans i18nKey="locations.shareEmail">
                    Share this location by <strong>e-mail</strong>
                  </Trans>
                </a>
              </div>
            )}

            {/* Report a problem with this location */}
            <div className="report-problem">
              <a
                href={
                  'mailto:HungerFreeOK@gmail.com?subject=Meals4KidsOK.org%20-%20Location%20Error%20Report!&body=' +
                  "I'd like to report a problem with the " +
                  '%3Cb%3E%3Ca%20href=%22' + // Encoded - <b><a href="
                  locationUrl +
                  '%22%3E' + // ">
                  location.name +
                  '%3C/a%3E%3C/b%3E' + // </a></b>
                  ' location on meals4kidsok.org%0D%0A%0D%0A' +
                  '%0D%0A' + // Line return
                  '%3Ci%3E' + // <i>
                  t('locations.addOwnNotes') +
                  '%3C/i%3E' //</i>
                }
                onClick={() => {
                  ReactGA.event({
                    category: 'Action',
                    action: 'Report a location'
                  });
                }}
              >
                <Icon icon="report_problem" />
                {t('locations.reportProblem')}
                {/* </Trans> */}
              </a>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

// Export
export default memo(LocationDetail);
