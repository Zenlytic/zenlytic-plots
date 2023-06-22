import React from 'react';
import { Pie as RechartsPie } from 'recharts';

export default function Pie({
  dataKey,
  nameKey,
  isAnimationActive,
  data,
  cx,
  cy,
  innerRadius,
  outerRadius,
  fill,
  label,
  paddingAngle,
  children,
}) {
  return (
    <RechartsPie
      dataKey={dataKey}
      nameKey={nameKey}
      isAnimationActive={isAnimationActive}
      data={data}
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      fill={fill}
      label={label}
      paddingAngle={paddingAngle}>
      {children}
    </RechartsPie>
  );
}
