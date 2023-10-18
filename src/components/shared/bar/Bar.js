/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Bar as RechartsBar } from 'recharts';
import DataAnnotation from '../data-annotation/DataAnnotation';
import Dot from '../dot/Dot';
import ActiveDot from '../dot/ActiveDot';

function Bar({
  dataKey,
  name,
  fill,
  stroke,
  children,
  id,
  data,
  key,
  fillOpacity,
  strokeOpacity,
  isAnimationActive = false,
  showDataAnnotations,
  position,
  onMouseOver = () => {},
  onMouseLeave = () => {},
  onClick = () => {},
  stackId,
  strokeWidth,
  radius = [4, 4, 0, 0],
  strokeDasharray,
  valueFormatter,
}) {
  const label = showDataAnnotations ? (
    <DataAnnotation
      valueFormatter={valueFormatter}
      position={position}
      shouldUseSpaceOffset={true}
    />
  ) : undefined;

  return (
    <RechartsBar
      dataKey={dataKey}
      name={name}
      label={label}
      fill={fill}
      stroke={stroke}
      id={id}
      data={data}
      key={key}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      stackId={stackId}
      isAnimationActive={isAnimationActive}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      radius={radius}>
      {children}
    </RechartsBar>
  );
}

export default Bar;
