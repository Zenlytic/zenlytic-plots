import React from 'react';
import { Text } from 'recharts';
import { getOffsetX } from './utils';

const Tick = ({ payload, tickFormatter, tickMaxLength, useWideYAxis, axisWidth, x, ...rest }) => {
  const rawValue = payload.value;

  const formattedValue = typeof tickFormatter === 'function' ? tickFormatter(rawValue) : rawValue;

  const offsetX = getOffsetX({ x });

  console.log({ rest, x });

  return (
    <Text {...rest} x={offsetX} fill={'#8C8C8C'} fontWeight={300} fontSize={'0.75rem'}>
      {formattedValue}
    </Text>
  );
};

export default Tick;
