/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { Line as RechartsLine } from 'recharts';
import DataAnnotation from '../data-annotation/DataAnnotation';

const getRenderDot = ({ fill, stroke }) => {
  return;
};

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
  yAxisId,
}) {
  const label = showDataAnnotations ? (
    <DataAnnotation valueFormatter={valueFormatter} />
  ) : undefined;

  const renderDot = ({ cx, cy }) => (
    <circle r="3" stroke="white" fill={stroke} strokeWidth="1" cx={cx} cy={cy} />
  );

  const renderActiveDot = ({ cx, cy }) => (
    <circle r="4" stroke="white" fill={stroke} strokeWidth="2" cx={cx} cy={cy} />
  );

  const dotProps =
    dot === true
      ? {
          dot: renderDot,
          activeDot: renderActiveDot,
        }
      : { dot: false };

  return (
    <RechartsLine
      type={type}
      dataKey={dataKey}
      name={name}
      key={key}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      isAnimationActive={isAnimationActive}
      label={label}
      data={data}
      yAxisId={yAxisId}
      {...dotProps}
    />
  );
}
