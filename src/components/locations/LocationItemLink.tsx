// Core
import React, { FunctionComponent, AnchorHTMLAttributes, memo } from 'react';
import Location from '../../types/location';
import { metersToRoundedMiles } from '../../lib/distanceHelpers';
// Styles
import './LocationItemLink.scss';
import Icon from '../Icon';
import { Link } from 'react-router-dom';

// Component
const LocationItemLink: FunctionComponent<
  { location: Location } & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ location, ...rest }) => {
  return (
    <Link to={`/locations/${location.id}`} className="LocationItemLink" {...rest}>
      <div className="name">{location.name}</div>
      <div className="location">
        {location.address} · {location.city}
        {location.distance && ` · ${metersToRoundedMiles(location.distance)}mi`}
      </div>
      <div className="status">
        <strong>Open Now</strong> Breakfast until 8am
      </div>
      <div className="meals">
        <Icon icon="local_dining" />
        <span className={location.servesBreakfast ? 'active' : ''}>Breakfast</span>
        <span className={location.servesLunch ? 'active' : ''}>Lunch</span>
        <span className={location.servesSnack ? 'active' : ''}>Snack</span>
        <span className={location.servesDinner ? 'active' : ''}>Dinner</span>
      </div>
      <div className="days">
        <Icon icon="event_available" />
        <span className={location.monday ? 'active' : ''}>Mon</span>
        <span className={location.tuesday ? 'active' : ''}>Tues</span>
        <span className={location.wednesday ? 'active' : ''}>Wed</span>
        <span className={location.thursday ? 'active' : ''}>Thurs</span>
        <span className={location.friday ? 'active' : ''}>Fri</span>
        <span className={location.saturday ? 'active' : ''}>Sat</span>
        <span className={location.sunday ? 'active' : ''}>Sun</span>
      </div>
    </Link>
  );
};

// Export
export default memo(LocationItemLink);
