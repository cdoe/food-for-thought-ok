// Core
import { FC, ReactNode } from 'react';
// Styles
import './PageBody.scss';

// Component
interface Props {
  children: ReactNode;
}
const PageBody: FC<Props> = ({ children }) => {
  return <main className="PageBody">{children}</main>;
};

// Export
export default PageBody;
