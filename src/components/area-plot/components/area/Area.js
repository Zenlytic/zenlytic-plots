/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-filename-extension */
import { Area as RechartsArea } from 'recharts';
import React from 'react';
import StackedDataAnnotation from '../stacked-data-annotation/StackedDataAnnotation';
import Dot from '../../../shared/dot/Dot';
import ActiveDot from '../../../shared/dot/ActiveDot';
import { DEFAULT_STROKE_WIDTH } from '../../../../constants/plotConstants';

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
  dot: showDot,
  showDataAnnotations,
  data,
  axisDataKey,
  getCurrentValue,
  getTotalValue,
  dataChangeType,
  valueFormatter,
}) {
  const dot = showDot ? <Dot color={stroke} /> : undefined;

  const activeDot = showDot ? <ActiveDot color={stroke} /> : undefined;

  return (
    <RechartsArea
      dot={dot}
      activeDot={activeDot}
      isAnimationActive={isAnimationActive}
      type={type}
      dataKey={dataKey}
      name={name}
      key={key}
      fill={fill}
      stroke={stroke}
      strokeWidth={DEFAULT_STROKE_WIDTH}
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
