// Core
import React, { FunctionComponent } from 'react';
// Styles
import './PageBody.scss';

// Component
const PageBody: FunctionComponent = props => {
  return <main id="PageBody">{props.children}</main>;
};

// Export
export default PageBody;
