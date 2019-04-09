// Core
import React, { FunctionComponent } from 'react';
// Styles
import './Icon.scss';

// Component
const Icon: FunctionComponent<{ icon: string }> = ({ icon }) => {
  return <i className="material-icon material-icons-round">{icon}</i>;
};

// Export
export default Icon;
