/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Line as RechartsLine } from 'recharts';
import DataAnnotation from '../data-annotation/DataAnnotation';

export default function Line({
  type,
  dataKey,
  name,
  key,
  fill,
  stroke,
  dot,
  strokeWidth,
  isAnimationActive,
  showDataAnnotations,
  valueFormatter,
  data,
}) {
  const label = showDataAnnotations ? (
    <DataAnnotation valueFormatter={valueFormatter} />
  ) : undefined;
  return (
    <RechartsLine
      type={type}
      dataKey={dataKey}
      name={name}
      key={key}
      fill={fill}
      stroke={stroke}
      dot={dot}
      strokeWidth={strokeWidth}
      isAnimationActive={isAnimationActive}
      label={label}
      data={data}
    />
  );
}
