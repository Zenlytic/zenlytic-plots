/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React, { useCallback } from 'react';
import { Label, YAxis as RechartsYAxis } from 'recharts';
import {
  DEFAULT_AXIS_PROPS,
  DEFAULT_LABEL_PROPS,
  DEFAULT_TICK_LINE,
} from '../../../constants/plotConstants';
import Tick from '../tick/Tick';

const YAxis = ({
  type,
  dataKey,
  name,
  tickFormatter,
  orientation,
  yAxisId,
  domain,
  width,
  interval = 'preserveEnd',
}) => {
  const TickMemoized = useCallback(
    (props) => <Tick orientation={orientation} shouldOffsetX={true} {...props} />,
    []
  );
  return (
    <RechartsYAxis
      {...DEFAULT_AXIS_PROPS}
      dataKey={dataKey}
      tickFormatter={tickFormatter}
      name={name}
      type={type}
      tick={TickMemoized}
      tickLine={DEFAULT_TICK_LINE}
      orientation={orientation}
      domain={domain}
      width={width}
      allowDataOverflow={true}
      interval={interval}
      yAxisId={yAxisId}>
      <Label
        {...DEFAULT_LABEL_PROPS}
        value={name}
        position={orientation === 'right' ? 'right' : 'left'}
        angle={orientation === 'right' ? 90 : -90}
      />
    </RechartsYAxis>
  );
};

YAxis.propTypes = {};

export default YAxis;
