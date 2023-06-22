import React from 'react';
import { Pie as RechartsPie } from 'recharts';
import colors from '../../../constants/colors';

export default function Pie({
  dataKey,
  nameKey,
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
  const labelLine = { strokeWidth: 1, stroke: colors.gray[200] };
  return (
    <RechartsPie
      dataKey={dataKey}
      nameKey={nameKey}
      isAnimationActive={false}
      data={data}
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      fill={fill}
      label={label}
      labelLine={labelLine}
      cornerRadius={7}
      paddingAngle={paddingAngle}>
      {children}
    </RechartsPie>
  );
}
