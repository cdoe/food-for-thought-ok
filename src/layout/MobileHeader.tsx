// Core
import React, { FunctionComponent, useContext, ReactElement } from 'react';
import { MobileNavCtx } from '../App';
// Styles
import './MobileHeader.scss';
// Components
import Icon from '../components/Icon';

const OpenNowFilter: FunctionComponent = () => {
  // const [openNowFilter, setOpenNowFilter] = useState(false);

  return <div className="open-now-filter">okay</div>;
};

// Component
const MobileHeader: FunctionComponent<{ hideMenuButton?: boolean; bottom?: ReactElement<any> }> = ({
  hideMenuButton = false,
  bottom,
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
      {!!bottom && <div className="bottom">{bottom}</div>}
    </div>
  );
};

// Export
export default MobileHeader;
