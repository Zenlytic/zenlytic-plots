/* eslint-disable react/jsx-filename-extension */
import React from 'react';

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
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function ScatterPlot({
  plotColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  categoryAxis = {},
  data = [],
  margin = {
    top: 32,
    left: 24,
    bottom: 40,
    right: 32,
  },
  width = 300,
  height = 300,
  CustomHoverTooltip = undefined,
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisDataKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisDataKey } = yAxis;
  const {
    label: categoryAxisLabel,
    format: categoryAxisFormat,
    dataKey: categoryAxisDataKey,
  } = categoryAxis;

  const getAxisFormatFromDataKey = (dataKey) => {
    if (dataKey === xAxisDataKey) {
      return xAxisFormat;
    }
    if (dataKey === yAxisDataKey) {
      return yAxisFormat;
    }
    if (dataKey === categoryAxisDataKey) {
      return categoryAxisFormat;
    }
    return '';
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <ScatterChart margin={margin} height={height} width={width}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          dataKey={xAxisDataKey}
          name={xAxisLabel}
          allowDecimals={false}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          dataKey={yAxisDataKey}
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
        <ZAxis dataKey={categoryAxisDataKey} name={categoryAxisLabel} />
        <Tooltip
          content={<TooltipHandler CustomHoverTooltip={CustomHoverTooltip} />}
          formatter={(value, dataKey) =>
            formatValue(getD3DataFormatter(getAxisFormatFromDataKey(dataKey), value), value)
          }
          labelFormatter={(value) => formatValue(getD3DataFormatter(xAxisFormat, value), value)}
        />
        <Scatter data={data} fill={plotColor} />
      </ScatterChart>
    </div>
  );
}

ScatterPlot.propTypes = {};

export default ScatterPlot;
