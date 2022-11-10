/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Bar as RechartsBar } from 'recharts';

function Bar(props) {
  return <RechartsBar strokeWidth={2} {...props} />;
}

export default Bar;
