// Core
import React, { FunctionComponent, HtmlHTMLAttributes, Fragment, memo } from 'react';
import Location from '../../types/location';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { useTranslation, Trans } from 'react-i18next';
import compact from 'lodash/compact';
import ReactGA from 'react-ga';
// import NumberFormat from 'react-number-format';
// Styles
import './LocationDetail.scss';
import Icon from '../Icon';
import LocationStatus from './LocationStatus';
import { DateTime } from 'luxon';
import { timeStringToDateTime } from '../../lib/dateTimeHelpers';
import { metersToRoundedMiles } from '../../lib/distanceHelpers';
import ClampLines from 'react-clamp-lines';

// Component
const LocationDetail: FunctionComponent<
  {
    location?: Location;
    mobileExpanded?: boolean;
  } & HtmlHTMLAttributes<HTMLDivElement>
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
        location.servesDinner && 'dinner',
      ])
    : [];

  const formatTime = (timeString: string | null) => {
    if (timeString) {
      return timeStringToDateTime(timeString).setLocale(i18n.language).toFormat('t');
    }
    return '';
  };

  const formatWeekday = (weekday: number) => {
    return DateTime.fromObject({ weekday }).setLocale(i18n.language).toFormat('EEEE');
  };

  const activeWeekdays = location
    ? compact([
        location.monday && formatWeekday(1),
        location.tuesday && formatWeekday(2),
        location.wednesday && formatWeekday(3),
        location.thursday && formatWeekday(4),
        location.friday && formatWeekday(5),
        location.saturday && formatWeekday(6),
        location.sunday && formatWeekday(7),
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

          {/* Location website */}
          {location.website && (
            <a
              href={
                location.website.includes('http') ? location.website : `https://${location.website}`
              }
              className="website"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                ReactGA.event({
                  category: 'Navigation',
                  action: 'Clicked location website link',
                });
              }}
            >
              <Icon icon="open_in_new" />
              {t('locations.website')}
            </a>
          )}

          {/* Unverified notice */}
          {!location.isVerified && (
            <div className="location-notice">
              <Icon icon="error" />
              <div>
                <Trans i18nKey="locations.unverified">
                  <strong>This site has not been verified.</strong> Please call the number listed or
                  check with your district to make sure the days and times listed are correct.
                </Trans>
              </div>
            </div>
          )}

          {/* Mobile notice */}
          {location.isMobile && (
            <div className="location-notice">
              <Icon icon="airport_shuttle" />
              <div>
                <Trans i18nKey="locations.isMobile">
                  <strong>This location is a mobile site.</strong> Please arrive early as meal times
                  may not be exact.
                </Trans>
              </div>
            </div>
          )}

          {/* Status */}
          <LocationStatus location={location} lineWrapped large />

          {/* Location notes (added during covid) */}
          {/* Mobile version */}
          {!!location.notes && (
            <ClampLines
              key={mobileExpanded ? 0 : 1}
              text={location.notes}
              id="mobile-clamped-notes"
              lines={mobileExpanded ? 8 : 2}
              buttons={mobileExpanded}
              moreText="Read more"
              lessText=""
              className="notes mobile"
            />
          )}
          {/* Non-mobile version */}
          {!!location.notes && <div className="notes desktop">{location.notes}</div>}

          {/* Below the fold on mobile */}
          <div
            className={classnames('mobile-expander', {
              expanded: mobileExpanded,
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
                        count: activeMeals.length,
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
                        count: activeWeekdays.length,
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

                {/* End date (possibly null since covid) */}
                {!!location.endDate && (
                  <div className="start-end-date">
                    {t('locations.mealsEnd')}{' '}
                    <span className="date">
                      {DateTime.fromJSDate(location.endDate)
                        .setLocale(i18n.language)
                        .toFormat('MMM d')}
                    </span>
                  </div>
                )}
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
                    count: metersToRoundedMiles(location.distance),
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
            {!!location.phone && (
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
                      action: 'Shared location on Facebook',
                    });
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon="thumb_up" />{' '}
                  <Trans i18nKey="locations.shareFacebook">
                    Share this location on <strong>Facebook</strong>
                  </Trans>
                </a>
                {/* Text message */}
                <a
                  href={`sms:?&body=${t('locations.shareBody')}%0D%0A${
                    location.name
                  } - ${locationUrl}`}
                  onClick={() => {
                    ReactGA.event({
                      category: 'Social',
                      action: 'Shared location by SMS',
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
                  href={`mailto:?subject=${t('locations.shareSubject')}&body=${t(
                    'locations.shareBody'
                  )}%0D%0A${location.name} - ${locationUrl}`}
                  onClick={() => {
                    ReactGA.event({
                      category: 'Social',
                      action: 'Shared location by email',
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
            <a
              className="report-problem"
              href={
                // Proof form
                process.env.REACT_APP_ENV === 'proof'
                  ? `https://docs.google.com/forms/d/e/1FAIpQLSce_5hNfpasvPoJpWgLRkGVScsw9wU3QSLhCuDtAdS_QTwmZQ/viewform?entry.1608006945=${encodeURIComponent(
                      location.name
                    )}`
                  : // Production form
                    `https://docs.google.com/forms/d/e/1FAIpQLSezSbT0y3V1lPxhgZj6Arz3RJsQk2DhmACCBbeAPYDRPqqIdQ/viewform?entry.1608006945=${encodeURIComponent(
                      location.name
                    )}`
              }
              onClick={() => {
                ReactGA.event({
                  category: 'Action',
                  action: 'Report a location',
                });
              }}
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon="report_problem" />
              {t('locations.reportProblem')}
            </a>
          </div>
        </Fragment>
      )}
    </div>
  );
};

// Export
export default memo(LocationDetail);
