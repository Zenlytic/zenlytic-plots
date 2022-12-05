/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import fontSizes from '../../../constants/fontSizes';

function DataAnnotation({ x, y, stroke, value, valueFormatter }) {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={fontSizes['2xs']} textAnchor="middle">
      {valueFormatter(value)}
    </text>
  );
}

export default DataAnnotation;
