/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
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

function ScatterPlot({
  plotColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  categoryAxis = {},
  data = [],
  margin = PLOT_MARGIN,
  width = 300,
  height = 300,
}) {
  const { label: xAxisLabel, format: xAxisFormat, columnIndex: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, columnIndex: yAxisKey } = yAxis;
  const {
    label: categoryAxisLabel,
    format: categoryAxisFormat,
    columnIndex: categoryAxisKey,
  } = categoryAxis;

  return (
    <div style={{ userSelect: 'none' }}>
      <ScatterChart margin={margin} height={height} width={width}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          dataKey={'x'}
          name={xAxisLabel}
          allowDecimals={false}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          dataKey={'y'}
          allowDecimals={false}
          name={yAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <ZAxis dataKey="category" name={categoryAxisLabel} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter data={data} fill={plotColor} />
      </ScatterChart>
    </div>
  );
}

ScatterPlot.propTypes = {};

export default ScatterPlot;
