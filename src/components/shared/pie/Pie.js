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
  onClick,
  cornerRadius,
}) {
  const labelLine = { strokeWidth: 1, stroke: colors.gray[200] };
  return (
    <RechartsPie
      dataKey={dataKey}
      nameKey={nameKey}
      isAnimationActive={true}
      data={data}
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      fill={fill}
      label={label}
      labelLine={labelLine}
      cornerRadius={cornerRadius}
      onClick={onClick}
      paddingAngle={paddingAngle}>
      {children}
    </RechartsPie>
  );
}
