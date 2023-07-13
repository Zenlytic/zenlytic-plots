/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ZAxis as RechartsZAxis } from 'recharts';

const ZAxis = ({ type, dataKey, name, tickFormatter }) => {
  return <RechartsZAxis dataKey={dataKey} tickFormatter={tickFormatter} name={name} />;
};

ZAxis.propTypes = {};

export default ZAxis;
