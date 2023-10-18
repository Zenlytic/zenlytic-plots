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
  onMouseOver = () => {},
  onMouseLeave = () => {},
  onClick = () => {},
  stackId,
  showDot,
  strokeWidth,
  radius = [4, 4, 0, 0],
  strokeDasharray,
  showDataAnnotations,
  valueFormatter,
}) {
  const label = showDataAnnotations ? (
    <DataAnnotation valueFormatter={valueFormatter} />
  ) : undefined;

  const dot = showDot ? <Dot color={stroke} /> : undefined;

  const activeDot = showDot ? <ActiveDot color={stroke} /> : undefined;

  return (
    <RechartsBar
      dot={dot}
      activeDot={activeDot}
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
