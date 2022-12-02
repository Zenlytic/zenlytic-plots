/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-filename-extension */
import { Area as RechartsArea } from 'recharts';
import React from 'react';
import StackedDataAnnotation from '../stacked-data-annotation/StackedDataAnnotation';

export function Area({
  type,
  dataKey,
  name,
  key,
  fill,
  stroke,
  strokeWidth,
  stackId,
  isAnimationActive,
  dot,
  showDataAnnotations,
  data,
  axisDataKey,
  getCurrentValue,
  getTotalValue,
  dataChangeType,
  valueFormatter,
}) {
  return (
    <RechartsArea
      dot={dot}
      isAnimationActive={isAnimationActive}
      type={type}
      dataKey={dataKey}
      name={name}
      key={key}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      stackId={stackId}
      label={
        showDataAnnotations ? (
          <StackedDataAnnotation
            data={data}
            dataKey={axisDataKey}
            getCurrentValue={getCurrentValue}
            getTotalValue={getTotalValue}
            dataChangeType={dataChangeType}
            valueFormatter={valueFormatter}
          />
        ) : undefined
      }
    />
  );
}
