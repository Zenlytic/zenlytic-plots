/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ZAxis as RechartsZAxis } from 'recharts';
import {
  DEFAULT_AXIS_COLOR,
  DEFAULT_TICK_PROPS,
  DEFAULT_Y_AXIS_WIDTH,
} from '../../../constants/plotConstants';

const ZAxis = ({ type, dataKey, name, tickFormatter }) => {
  return <RechartsZAxis dataKey={dataKey} tickFormatter={tickFormatter} name={name} />;
};

ZAxis.propTypes = {};

export default ZAxis;
