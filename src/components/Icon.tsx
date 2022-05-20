// Core
import { FC, HTMLAttributes, memo } from 'react';
// Styles
import './Icon.scss';

// Component
interface Props extends HTMLAttributes<HTMLElement> {
  icon: string;
}
const Icon: FC<Props> = ({ icon, className = '' }) => {
  return <i className={'material-icon material-icons-round ' + className}>{icon}</i>;
};

// Export
export default memo(Icon);
