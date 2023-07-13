/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Line as RechartsLine } from 'recharts';
import DataAnnotation from '../data-annotation/DataAnnotation';
import Dot from '../dot/Dot';
import ActiveDot from '../dot/ActiveDot';
import { DEFAULT_STROKE_WIDTH } from '../../../constants/plotConstants';

export default function Line({
  type,
  dataKey,
  name,
  key,
  color,
  dot: showDot,
  isAnimationActive,
  showDataAnnotations,
  valueFormatter,
  data,
  yAxisId,
}) {
  const label = showDataAnnotations ? (
    <DataAnnotation valueFormatter={valueFormatter} />
  ) : undefined;

  const dot = showDot ? <Dot color={color} /> : undefined;

  const activeDot = showDot ? <ActiveDot color={color} /> : undefined;

  return (
    <RechartsLine
      type={type}
      dataKey={dataKey}
      name={name}
      key={key}
      stroke={color}
      dot={dot}
      activeDot={activeDot}
      strokeWidth={DEFAULT_STROKE_WIDTH}
      isAnimationActive={isAnimationActive}
      label={label}
      data={data}
      yAxisId={yAxisId}
    />
  );
}
