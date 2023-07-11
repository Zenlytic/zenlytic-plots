import { Text } from 'recharts';
import React from 'react';
import { DEFAULT_TICK_PROPS } from '../../../constants/plotConstants';

const AXIS_WIDTH_TO_TEXT_LENGTH_MULTIPLIER = 0.8;

const FORMATTED_VALUE_LENGTH_THRESHOLD = 11;

const Tick = (props) => {
  const rawValue = props.payload.value;

  const formattedValue =
    typeof props.tickFormatter === 'function' ? props.tickFormatter(rawValue) : rawValue;

  const formattedValueLength = formattedValue.toString().length;

  const shouldUseTextLength =
    !props.useWideYAxis && formattedValueLength > FORMATTED_VALUE_LENGTH_THRESHOLD;

  // Limit text length when it exceeds threshold.
  const textLength = shouldUseTextLength
    ? (props.axisWidth ?? 80) * AXIS_WIDTH_TO_TEXT_LENGTH_MULTIPLIER
    : undefined;

  console.log({ textLength, props, formattedValue, formattedValueLength });
  return (
    <Text {...props} {...DEFAULT_TICK_PROPS} textLength={textLength}>
      {formattedValue}
    </Text>
  );
};

export default Tick;
