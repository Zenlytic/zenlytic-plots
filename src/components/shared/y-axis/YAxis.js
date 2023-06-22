/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Label, YAxis as RechartsYAxis } from 'recharts';
import {
  DEFAULT_AXIS_COLOR,
  DEFAULT_LABEL_PROPS,
  DEFAULT_TICK_PROPS,
} from '../../../constants/plotConstants';

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
  return (
    <RechartsYAxis
      dataKey={dataKey}
      tickFormatter={tickFormatter}
      name={name}
      type={type}
      stroke={DEFAULT_AXIS_COLOR}
      width={width}
      tick={DEFAULT_TICK_PROPS}
      orientation={orientation}
      domain={domain}
      // TODO: NJM Consider setting this to `false` when a domain is not specified.
      // That way it won't cut off the dots.
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
