// Core
import React, { FunctionComponent } from 'react';
// Styles
import './PageBody.scss';

// Component
const PageBody: FunctionComponent = props => {
  return <main className="PageBody">{props.children}</main>;
};

// Export
export default PageBody;
