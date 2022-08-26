/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { changeTypes } from '../../../constants/plotConstants';

// TODO: NJM Rewrite this to move logic out of here and into area plot file.
function getFormattedValue({
  valueFormatter,
  value,
  index,
  getTotalValue,
  dataChangeType = changeTypes.ABSOLUTE,
}) {
  if (dataChangeType === changeTypes.ABSOLUTE) {
    return valueFormatter(value);
  }

  // Percentages
  const totalValue = getTotalValue(index);

  if (totalValue === 0) {
    return '0%';
  }

  return `${((100 * value) / totalValue).toFixed(1)}%`;
}

function DataAnnotation({
  x,
  y,
  stroke,
  value,
  valueFormatter,
  dataChangeType,
  index,
  // TODO: NJM Antipattern, try to get rid of it
  // Removing it introduces transient issue where data annotations
  // don't show up.
  showDataAnnotations = true,
  getTotalValue,
}) {
  if (!showDataAnnotations) {
    return null;
  }
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {getFormattedValue({
        valueFormatter,
        value,
        index,
        getTotalValue,
        dataChangeType,
      })}
    </text>
  );
}

export default DataAnnotation;
