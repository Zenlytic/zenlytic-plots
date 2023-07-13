import React from 'react';
import { Text } from 'recharts';
import { getOffsetX, getOffsetY } from './utils';
import colors from '../../../constants/colors';
import fontWeights from '../../../constants/fontWeights';
import fontSizes from '../../../constants/fontSizes';

const Tick = ({
  payload,
  tickFormatter,
  orientation,
  x,
  y,
  shouldOffsetX,
  shouldOffsetY,
  ...rest
}) => {
  const rawValue = payload.value;

  const formattedValue = typeof tickFormatter === 'function' ? tickFormatter(rawValue) : rawValue;

  const offsetX = shouldOffsetX ? getOffsetX({ x, orientation }) : x;

  const offsetY = shouldOffsetY ? getOffsetY({ y }) : y;

  return (
    <Text
      {...rest}
      className={''}
      x={offsetX}
      y={offsetY}
      color={colors.gray[400]}
      fill={colors.gray[400]}
      fontWeight={fontWeights.thin}
      fontSize={fontSizes.xs}>
      {formattedValue}
    </Text>
  );
};

export default Tick;
