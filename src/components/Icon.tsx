// Core
import React, { FunctionComponent, HTMLAttributes, memo } from 'react';
// Styles
import './Icon.scss';

// Component
const Icon: FunctionComponent<HTMLAttributes<HTMLElement> & { icon: string }> = ({
  icon,
  className = ''
}) => {
  return <i className={'material-icon material-icons-round ' + className}>{icon}</i>;
};

// Export
export default memo(Icon);
