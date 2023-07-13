/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React, { useCallback } from 'react';
import { Label, XAxis as RechartsXAxis } from 'recharts';
import {
  DEFAULT_AXIS_PROPS,
  DEFAULT_LABEL_PROPS,
  DEFAULT_TICK_LINE,
  DEFAULT_X_AXIS_HEIGHT,
} from '../../../constants/plotConstants';
import Tick from '../tick/Tick';

const XAxis = (props) => {
  const {
    name,
    type = 'number',
    dataKey,
    tickFormatter,
    allowDuplicatedCategory,
    interval = 'preserveEnd',
    tickLine = DEFAULT_TICK_LINE,
    rotateXAxis = false,
  } = props;

  const TickMemoized = useCallback((props) => <Tick shouldOffsetY={true} {...props} />, []);

  return (
    <RechartsXAxis
      {...DEFAULT_AXIS_PROPS}
      dataKey={dataKey}
      name={name}
      type={type}
      tickFormatter={tickFormatter}
      allowDuplicatedCategory={allowDuplicatedCategory}
      height={rotateXAxis ? 150 : DEFAULT_X_AXIS_HEIGHT}
      interval={interval}
      tickLine={tickLine}
      minTickGap={rotateXAxis ? 0 : undefined}
      textAnchor={rotateXAxis ? 'end' : 'middle'}
      angle={rotateXAxis ? -90 : undefined}
      dx={rotateXAxis ? -5 : undefined}
      tick={TickMemoized}>
      <Label {...DEFAULT_LABEL_PROPS} value={name} position="bottom" />
    </RechartsXAxis>
  );
};

export default XAxis;
