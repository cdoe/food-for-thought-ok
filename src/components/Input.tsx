// Core
import { FC, InputHTMLAttributes, memo, RefObject } from 'react';
// Styles
import './Input.scss';

// Component
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  forwardedRef?: RefObject<HTMLInputElement>;
}
const Input: FC<Props> = ({ forwardedRef, ...rest }) => {
  return <input className="input" ref={forwardedRef} {...rest} />;
};

// Export
export default memo(Input);
