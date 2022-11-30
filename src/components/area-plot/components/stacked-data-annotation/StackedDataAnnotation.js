/* eslint-disable react/prop-types */
import React from 'react';
import { dataChangeTypes } from '../../../../constants/plotConstants';
import DataAnnotation from '../../../shared/data-annotation/DataAnnotation';

function getFormattedAbsoluteValue({ currentValue, valueFormatter }) {
  return valueFormatter(currentValue);
}

function getFormattedPercentageValue({ currentValue, getTotalValue, index }) {
  const totalValue = getTotalValue(index);

  if (totalValue === 0) {
    return '0%';
  }

  return `${((100 * currentValue) / totalValue).toFixed(1)}%`;
}

export default function StackedDataAnnotation({
  x,
  y,
  stroke,
  valueFormatter,
  dataChangeType,
  index,
  getTotalValue,
  // The `value` prop that Recharts passes this component is the "cumulative" value,
  // so if it comes from a line that is stacked on others, it will be bigger than the
  // actual value we want to display in the annotation, so we use this `getCurrentValue` prop.
  getCurrentValue,
  dataKey,
}) {
  const currentValue = getCurrentValue(index, dataKey);

  const changeTypeToFormattingFunc = {
    [dataChangeTypes.ABSOLUTE]: () => getFormattedAbsoluteValue({ currentValue, valueFormatter }),
    [dataChangeTypes.PERCENT]: () =>
      getFormattedPercentageValue({ currentValue, getTotalValue, index }),
  };

  const formattedValue = changeTypeToFormattingFunc[dataChangeType]();

  return DataAnnotation({ x, y, stroke, value: formattedValue });
}
