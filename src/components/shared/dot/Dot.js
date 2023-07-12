import React from 'react';

function Dot({ color, strokeWidth, radius, ...rest }) {
  if (rest.cy === null) {
    return null;
  }
  return <circle {...rest} strokeWidth={strokeWidth} fill={color} stroke="white" r={radius} />;
}

export default Dot;
