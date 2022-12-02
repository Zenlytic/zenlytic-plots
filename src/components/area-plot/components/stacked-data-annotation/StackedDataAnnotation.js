/* eslint-disable react/prop-types */
import React from 'react';
import { dataChangeTypes } from '../../../../constants/plotConstants';
import { getRatioSafe } from '../../../../utils/numberUtils';
import { getFormatter } from '../../../../utils/plotConfigGetters';
import DataAnnotation from '../../../shared/data-annotation/DataAnnotation';

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
  const totalValue = getTotalValue(index);

  const { value, valueFormatterForDataChangeType } = {
    [dataChangeTypes.ABSOLUTE]: {
      valueFormatterForDataChangeType: valueFormatter,
      value: currentValue,
    },
    [dataChangeTypes.PERCENT]: {
      valueFormatterForDataChangeType: getFormatter('percent_1'),
      value: getRatioSafe(currentValue, totalValue),
    },
  }[dataChangeType];

  return DataAnnotation({ x, y, stroke, value, valueFormatter: valueFormatterForDataChangeType });
}
