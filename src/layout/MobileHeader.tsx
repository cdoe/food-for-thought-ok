// Core
import React, { FunctionComponent, useContext, ReactElement } from 'react';
import { MobileNavCtx } from '../App';
// Styles
import './MobileHeader.scss';
// Components
import Icon from '../components/Icon';

// Component
const MobileHeader: FunctionComponent<{ hideMenuButton?: boolean; bottom?: ReactElement<any> }> = ({
  hideMenuButton = false,
  bottom,
  children
}) => {
  const mobileNavContext = useContext(MobileNavCtx);
  const setMobileNavIsOpen = mobileNavContext[1];

  return (
    <div className="MobileHeader">
      {/* Button to open navigation */}
      {!hideMenuButton && (
        <button
          className="open-nav-btn"
          onClick={event => {
            event.preventDefault();
            setMobileNavIsOpen(true);
          }}
        >
          <Icon icon="menu" />
        </button>
      )}
      <div className="content">{children}</div>
      {!!bottom && <div className="bottom">{bottom}</div>}
    </div>
  );
};

// Export
export default MobileHeader;
