/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { PLOT_MARGIN } from '../../constants/plotConstants';
import { Legend } from '@visx/legend';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';

function BarPlot({
  plotColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  data = [],
  margin = PLOT_MARGIN,
  width = 300,
  height = 300,
}) {
  const { label: xAxisLabel, format: xAxisFormat, columnIndex: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, columnIndex: yAxisKey } = yAxis;

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart margin={margin} height={height} width={width} data={data} layout="vertical">
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          dataKey={'value'}
          name={xAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          type="category"
          dataKey={'label'}
          name={yAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          {/* <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          /> */}
        </YAxis>
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Bar dataKey="value" fill={plotColor} />
      </BarChart>
    </div>
  );
}

BarPlot.propTypes = {};

export default BarPlot;
