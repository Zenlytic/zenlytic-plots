/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import fontSizes from '../../../constants/fontSizes';

function DataAnnotation({
  x,
  y,
  dx,
  dy,
  width,
  height,
  offset,
  value,
  valueFormatter,
  position,
  shouldUseSpaceOffset,
}) {
  const positionAttributes = {
    top: {
      x: shouldUseSpaceOffset ? x + width / 2 : x,
      y: y,
      dy: -4,
      textAnchor: 'middle',
    },
    right: {
      x: x + width + offset,
      y: shouldUseSpaceOffset ? y + height / 2 : y,
      textAnchor: 'start',
    },
  }[position];

  return (
    <text
      x={x}
      y={y}
      dx={dx}
      dy={dy}
      {...positionAttributes}
      fill={'black'}
      fontSize={fontSizes['2xs']}>
      {valueFormatter(value)}
    </text>
  );
}

export default DataAnnotation;
