/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { changeTypes } from '../../../constants/plotConstants';

// TODO: NJM Rewrite this to move logic out of here and into area plot file.
function getFormattedValue({
  valueFormatter,
  getCurrentValue,
  dataKey,
  index,
  getTotalValue,
  value,
  dataChangeType = changeTypes.ABSOLUTE,
}) {
  if (!getTotalValue) {
    return valueFormatter(value);
  }
  const currentValue = getCurrentValue(index, dataKey);
  if (dataChangeType === changeTypes.ABSOLUTE) {
    return valueFormatter(currentValue);
  }

  // Percentages
  const totalValue = getTotalValue(index);

  if (totalValue === 0) {
    return '0%';
  }

  return `${((100 * currentValue) / totalValue).toFixed(1)}%`;
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
  getCurrentValue,
  dataKey,
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
        getCurrentValue,
        dataKey,
        dataChangeType,
      })}
    </text>
  );
}

export default DataAnnotation;
