// Core
import React, { FunctionComponent } from 'react';
import Location from '../types/location';
// Styles
import './LocationItem.scss';
import Icon from './Icon';

// Component
const LocationItem: FunctionComponent<{ location: Location }> = ({ location, ...props }) => {
  return (
    <div className="LocationItem">
      <div className="name">{location.name}</div>
      <div className="location">
        {location.address} · {location.city}
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
    </div>
  );
};

// Export
export default LocationItem;
