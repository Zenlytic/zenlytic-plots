import React from 'react';
import { Text } from 'recharts';

const Tick = ({ payload, tickFormatter, tickMaxLength, useWideYAxis, axisWidth, ...rest }) => {
  const rawValue = payload.value;

  const formattedValue = typeof tickFormatter === 'function' ? tickFormatter(rawValue) : rawValue;
  return (
    <Text {...rest} fill={'#8C8C8C'} fontWeight={300} fontSize={'0.75rem'}>
      {formattedValue}
    </Text>
  );
};

export default Tick;
