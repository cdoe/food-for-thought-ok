// Core
import React, { FunctionComponent } from 'react';
// Styles
import './PageWrapper.scss';

// Component
const PageWrapper: FunctionComponent = props => {
  return <div className="PageWrapper">{props.children}</div>;
};

// Export
export default PageWrapper;
