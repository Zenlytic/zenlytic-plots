/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Label, XAxis as RechartsXAxis } from 'recharts';
import {
  DEFAULT_AXIS_COLOR,
  DEFAULT_LABEL_PROPS,
  DEFAULT_TICK_PROPS,
  DEFAULT_X_AXIS_HEIGHT,
} from '../../../constants/plotConstants';

const XAxis = (props) => {
  const {
    name,
    type = 'number',
    dataKey,
    tickFormatter,
    allowDuplicatedCategory,
    tickLine = true,
    interval = 'preserveEnd',
    rotateXAxis = false,
  } = props;

  return (
    <RechartsXAxis
      dataKey={dataKey}
      name={name}
      type={type}
      tickFormatter={tickFormatter}
      allowDuplicatedCategory={allowDuplicatedCategory}
      stroke={DEFAULT_AXIS_COLOR}
      height={rotateXAxis ? 150 : DEFAULT_X_AXIS_HEIGHT}
      tickLine={tickLine}
      interval={interval}
      minTickGap={rotateXAxis ? 0 : undefined}
      textAnchor={rotateXAxis ? 'end' : 'middle'}
      angle={rotateXAxis ? -90 : undefined}
      dx={rotateXAxis ? -5 : undefined}
      tick={DEFAULT_TICK_PROPS}>
      <Label {...DEFAULT_LABEL_PROPS} value={name} position="bottom" />
    </RechartsXAxis>
  );
};

export default XAxis;
