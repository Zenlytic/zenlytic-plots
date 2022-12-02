/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

function DataAnnotation({ x, y, stroke, value, valueFormatter }) {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {valueFormatter(value)}
    </text>
  );
}

export default DataAnnotation;
