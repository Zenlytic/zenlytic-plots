/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Line as RechartsLine } from 'recharts';
import DataAnnotation from '../data-annotation/DataAnnotation';
import Dot from '../dot/Dot';

export default function Line({
  type,
  dataKey,
  name,
  key,
  color,
  dot: showDot,
  strokeWidth,
  isAnimationActive,
  showDataAnnotations,
  valueFormatter,
  data,
  yAxisId,
}) {
  const label = showDataAnnotations ? (
    <DataAnnotation valueFormatter={valueFormatter} />
  ) : undefined;

  const dot = showDot ? <Dot color={color} strokeWidth={1} radius="2" /> : undefined;

  const activeDot = showDot ? <Dot color={color} strokeWidth={2} radius="4" /> : undefined;

  return (
    <RechartsLine
      type={type}
      dataKey={dataKey}
      name={name}
      key={key}
      stroke={color}
      dot={dot}
      activeDot={activeDot}
      strokeWidth={strokeWidth}
      isAnimationActive={isAnimationActive}
      label={label}
      data={data}
      yAxisId={yAxisId}
    />
  );
}
