// Core
import React, { FunctionComponent, HtmlHTMLAttributes, Fragment, useState, memo } from 'react';
import Location from '../../types/location';
import classnames from 'classnames';
import NumberFormat from 'react-number-format';
// Styles
import './LocationDetail.scss';
import Icon from '../Icon';

// Component
const LocationDetail: FunctionComponent<
  { location?: Location; mobileExpanded?: boolean } & HtmlHTMLAttributes<HTMLDivElement>
> = ({ location, mobileExpanded = false, ...rest }) => {
  const [phoneValue, setPhoneValue] = useState('');
  const [formattedPhoneValue, setFormattedPhoneValue] = useState('');

  return (
    <div className="LocationDetail" {...rest}>
      {location && (
        <Fragment>
          <div className="name">{location.name}</div>

          <div className="status">
            <strong>Open Now</strong>
            Breakfast until 8am
          </div>

          <div className={classnames('mobile-expander', { expanded: mobileExpanded })}>
            <div className="wavy-line-divider" />

            <div className="schedule-wrapper">
              <div className="cell meals">
                <div className="summary">2 meals</div>
                <div className="meal">Breakfast</div>
                <div className="time">8:00 - 8:30am</div>
                <div className="meal">Lunch</div>
                <div className="time">11:30 - 12:00pm</div>
              </div>

              <div className="cell days">
                <div className="summary">3 days a week</div>
                <div className="day">Monday</div>
                <div className="day">Wednesday</div>
                <div className="day">Friday</div>
                <div className="start-end">
                  Service ends <span className="date">July 27</span>
                </div>
              </div>
            </div>

            <div className="wavy-line-divider" />

            <div className="text-notifications">
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
            </div>

            <div className="location">
              <div className="address">{location.address}</div>
              <div className="city">{location.city}, OK</div>
              <div className="distance">2 miles away</div>
              <a
                href={
                  'https://www.google.com/maps/dir/?api=1&destination=' +
                  encodeURIComponent(`${location.name}, ${location.address}, ${location.city}, OK`)
                }
                className="directions-link"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon icon="directions" /> Get directions
              </a>
            </div>

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

            <div className="sharing">
              <a
                href={
                  'https://www.facebook.com/sharer/sharer.php?u=meals4kids.org/locations/' +
                  location.id
                }
              >
                <Icon icon="thumb_up" /> Share this location on <strong>Facebook</strong>
              </a>
              <a href="sms:?&body=No-cost meals for kids ALL SUMMER!">
                <Icon icon="message" /> Share this location by <strong>text message</strong>
              </a>
              <a href="mailto:?subject=No-cost meals for kids ALL SUMMER!&body=Blah">
                <Icon icon="email" /> Share this location by <strong>e-mail</strong>
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
