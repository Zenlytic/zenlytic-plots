/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Bar as RechartsBar } from 'recharts';

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
  onMouseOver = () => {},
  onMouseLeave = () => {},
  onClick = () => {},
  stackId,
  strokeWidth = 2,
}) {
  return (
    <RechartsBar
      dataKey={dataKey}
      name={name}
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
      strokeWidth={strokeWidth}>
      {children}
    </RechartsBar>
  );
}

export default Bar;
