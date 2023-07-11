import React from 'react';
import { Text } from 'recharts';

const AXIS_WIDTH_TO_TEXT_LENGTH_MULTIPLIER = 0.8;

const FORMATTED_VALUE_LENGTH_THRESHOLD = 11;

const Tick = ({ payload, tickFormatter, tickMaxLength, useWideYAxis, axisWidth, ...rest }) => {
  const rawValue = payload.value;

  const formattedValue = typeof tickFormatter === 'function' ? tickFormatter(rawValue) : rawValue;

  console.log({ payload, tickMaxLength, axisWidth, formattedValue, rest });
  return (
    <Text {...rest} fill={'#8C8C8C'} fontWeight={300} fontSize={'0.75rem'}>
      {formattedValue}
    </Text>
  );
};

export default Tick;
