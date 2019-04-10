// Core
import React, { FunctionComponent } from 'react';
// Styles
import './Input.scss';

// Component
const Input: FunctionComponent<any> = props => {
  return <input className="input" {...props} />;
};

// Export
export default Input;
