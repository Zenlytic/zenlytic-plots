/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { changeTypes } from '../../../constants/plotConstants';

function getFormattedValue({
  valueFormatter,
  value,
  index,
  data,
  categoryKeyValues,
  dataKey,
  dataChangeType,
}) {
  if (dataChangeType === changeTypes.ABSOLUTE) {
    return valueFormatter(value);
  }

  // Percentages
  const datum = data[index];
  const categoryValue = datum[dataKey];
  const totalValue = categoryKeyValues.reduce(
    (total, categoryKeyValue) => datum[categoryKeyValue] + total,
    0
  );

  if (totalValue === 0) {
    return '0%';
  }

  return `${((100 * categoryValue) / totalValue).toFixed(1)}%`;
}

function DataAnnotation({
  x,
  y,
  stroke,
  value,
  valueFormatter,
  dataChangeType,
  data,
  index,
  categoryKeyValues,
  dataKey,
}) {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {getFormattedValue({
        valueFormatter,
        value,
        index,
        data,
        categoryKeyValues,
        dataChangeType,
        dataKey,
      })}
    </text>
  );
}

export default DataAnnotation;
