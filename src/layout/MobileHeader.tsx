// Core
import React, { FunctionComponent, useContext } from 'react';
import { MobileNavCtx } from '../App';
// Styles
import './MobileHeader.scss';
// Components
import Icon from '../components/Icon';

// Component
const MobileHeader: FunctionComponent<{ hideMenuButton?: boolean }> = ({
  hideMenuButton,
  children
}) => {
  const [mobileNavIsOpen, setMobileNavIsOpen] = useContext(MobileNavCtx);

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
    </div>
  );
};

// Export
export default MobileHeader;
