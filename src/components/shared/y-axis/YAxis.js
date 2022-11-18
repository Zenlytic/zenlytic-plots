/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Label, YAxis as RechartsYAxis } from 'recharts';
import {
  DEFAULT_AXIS_COLOR,
  DEFAULT_LABEL_PROPS,
  DEFAULT_TICK_PROPS,
  DEFAULT_Y_AXIS_WIDTH,
} from '../../../constants/plotConstants';

const YAxis = ({ type, dataKey, name, tickFormatter }) => {
  return (
    <RechartsYAxis
      dataKey={dataKey}
      tickFormatter={tickFormatter}
      name={name}
      type={type}
      stroke={DEFAULT_AXIS_COLOR}
      width={DEFAULT_Y_AXIS_WIDTH}
      tick={DEFAULT_TICK_PROPS}>
      <Label {...DEFAULT_LABEL_PROPS} value={name} position="left" angle={-90} />
    </RechartsYAxis>
  );
};

YAxis.propTypes = {};

export default YAxis;
