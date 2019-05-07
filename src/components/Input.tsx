// Core
import React, { FunctionComponent, InputHTMLAttributes, memo, RefObject } from 'react';
// Styles
import './Input.scss';

// Component
const Input: FunctionComponent<
  InputHTMLAttributes<HTMLInputElement> & { forwardedRef?: RefObject<HTMLInputElement> }
> = ({ forwardedRef, ...rest }) => {
  return <input className="input" ref={forwardedRef} {...rest} />;
};

// Export
export default memo(Input);
