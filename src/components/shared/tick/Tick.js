import { Text } from 'recharts';
import React from 'react';
import { DEFAULT_TICK_PROPS } from '../../../constants/plotConstants';

const Tick = (props) => {
  console.log(props);
  const rawValue = props.payload.value;
  const formattedValue =
    typeof props.tickFormatter === 'function' ? props.tickFormatter(rawValue) : rawValue;
  return (
    <Text {...props} {...DEFAULT_TICK_PROPS}>
      {formattedValue}
    </Text>
  );
};

export default Tick;
