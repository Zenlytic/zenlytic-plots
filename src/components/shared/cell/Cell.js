import React from 'react';
import { Cell as RechartsCell } from 'recharts';

export default function Cell({
  key,
  id,
  fill,
  strokeWidth,
  stroke,
  fillOpacity,
  onMouseOver,
  onMouseLeave,
}) {
  return (
    <RechartsCell
      key={key}
      fill={fill}
      id={id}
      strokeWidth={strokeWidth}
      stroke={stroke}
      fillOpacity={fillOpacity}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      cursor="pointer"
    />
  );
}
