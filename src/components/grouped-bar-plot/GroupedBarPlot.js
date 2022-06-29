/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
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

function GroupedBarPlot({
  plotColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  categoryAxis = {},
  data = [],
  margin = {
    top: 32,
    left: 32,
    bottom: 40,
    right: 32,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  width = 300,
  height = 300,
  layout = 'horizontal',
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisKey } = yAxis;
  const {
    label: categoryAxisLabel,
    format: categoryAxisFormat,
    dataKey: categoryAxisKey,
  } = categoryAxis;

  const colors = [
    '#0f93e5',
    '#e6ac00',
    '#d510d9',
    '#e57c04',
    '#dac611',
    '#74d912',
    '#2ac2a5',
    '#1501e5',
    '#de0c08',
  ];

  const [hoveredLineDataKey, setHoveredLineDataKey] = useState(null);

  const onLegendItemHover = (item) => {
    const { value } = item;
    setHoveredLineDataKey(value);
  };

  const onLegendItemLeave = (item) => {
    setHoveredLineDataKey(null);
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart margin={margin} height={height} width={width} data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey={xAxisKey}
          name={xAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
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
        <Tooltip
          content={<TooltipHandler CustomHoverTooltip={CustomHoverTooltip} />}
          formatter={(value) => formatValue(getD3DataFormatter(yAxisFormat, value), value)}
          labelFormatter={(value) => formatValue(getD3DataFormatter(xAxisFormat, value), value)}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={12}
          wrapperStyle={{
            paddingLeft: '16px',
            paddingBottom: margin.bottom,
          }}
          onMouseEnter={onLegendItemHover}
          onMouseLeave={onLegendItemLeave}
        />
        {/* {data?.map((bar) => {
          <Bar dataKey="value" name={xAxisLabel} fill={plotColor} />;
        })} */}
        {Object.keys(data[0]).map((key, index) => {
          if (key === xAxisKey) return false;
          return (
            <Bar
              dataKey={key}
              fill={colors[index % colors.length]}
              fillOpacity={
                key === hoveredLineDataKey ? 1.0 : hoveredLineDataKey === null ? 1.0 : 0.2
              }
            />
          );
        })}
      </BarChart>
    </div>
  );
}

GroupedBarPlot.propTypes = {};

export default GroupedBarPlot;
