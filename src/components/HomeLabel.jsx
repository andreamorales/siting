import React from 'react';

export default function HomeLabel({ children, as = 'span', className = '', ...rest }) {
  return React.createElement(
    as,
    { className: `home-label ${className}`.trim(), ...rest },
    children,
  );
}
