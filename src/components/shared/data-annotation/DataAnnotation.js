/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import fontSizes from '../../../constants/fontSizes';
import colors from '../../../constants/colors';

function DataAnnotation({
  x,
  y,
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
      y: y - offset,
      textAnchor: 'middle',
      verticalAnchor: 'end',
    },
    right: {
      x: x + width + offset,
      y: shouldUseSpaceOffset ? y + height / 2 : y,
      textAnchor: 'start',
      verticalAnchor: 'middle',
    },
  }[position];

  return (
    <text x={x} y={y} {...positionAttributes} fill={colors.gray[800]} fontSize={fontSizes['2xs']}>
      {valueFormatter(value)}
    </text>
  );
}

export default DataAnnotation;
