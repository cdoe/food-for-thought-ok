// Core
import { FC, ReactNode } from 'react';
// Styles
import './PageWrapper.scss';

// Component
interface Props {
  children: ReactNode;
}
const PageWrapper: FC<Props> = ({ children }) => {
  return <div className="PageWrapper">{children}</div>;
};

// Export
export default PageWrapper;
