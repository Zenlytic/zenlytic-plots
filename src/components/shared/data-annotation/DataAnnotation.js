/* eslint-disable react/jsx-filename-extension */
import React from 'react';

const DataAnnotation = ({ x, y, stroke, value, formatter = () => {} }) => {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {formatter(value)}
    </text>
  );
};

export default DataAnnotation;
