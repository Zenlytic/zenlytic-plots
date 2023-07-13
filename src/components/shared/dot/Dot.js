import React from 'react';

function Dot({ color, strokeWidth = 1, radius = '2', ...rest }) {
  return <circle {...rest} strokeWidth={strokeWidth} fill={color} stroke="white" r={radius} />;
}

export default Dot;
