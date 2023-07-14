import React from 'react';

function Dot({ cx, cy, color, strokeWidth = 1, radius = '2', ...rest }) {
  if (cx === null || cy === null) {
    return null;
  }
  return (
    <circle
      {...rest}
      cx={cx}
      cy={cy}
      strokeWidth={strokeWidth}
      fill={color}
      stroke="white"
      r={radius}
    />
  );
}

export default Dot;
