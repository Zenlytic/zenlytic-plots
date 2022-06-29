/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
  LabelList,
} from 'recharts';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function WaterfallPlot({
  plotColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  data = [],
  margin = {
    top: 32,
    left: 32,
    bottom: 40,
    right: 32,
  },
  width = 300,
  height = 300,
  CustomHoverTooltip = undefined,
}) {
  const { label: xAxisLabel = 'X-Axis', format: xAxisFormat, dataKey: xAxisKey } = xAxis;
  const { label: yAxisLabel = 'Y-Axis', format: yAxisFormat, dataKey: yAxisKey } = yAxis;

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value, fill, label, index } = props;

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
    const [clickTooltipCoords, setClickTooltipCoords] = useState();

    const closeClickTooltip = () => {
      setIsClickTooltipVisible(false);
      setClickTooltipCoords(null);
    };

    // const radius = 10;

    const verticalOffset = height >= 0 ? 10 : -10;
    const textColor = height >= 0 ? 'green' : 'red';

    if (index === 0 || index === data.length - 1 || index === data.length - 2) return null;
    return (
      <g>
        <text
          x={x + width / 2}
          y={y - verticalOffset}
          position="top"
          fill={textColor}
          textAnchor="middle"
          dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart
        margin={margin}
        height={height}
        width={width}
        data={data}
        onClick={(a) => console.log(a)}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name">
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          type="number"
          width={80}
          // tickFormatter={(timeStr) => formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)}
        >
          <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip content={<TooltipHandler CustomHoverTooltip={CustomHoverTooltip} />} />
        {/* <Legend /> */}
        <Bar dataKey="startValue" stackId="a" fill="transparent" />
        <Bar dataKey="valueChange" stackId="a" radius={2}>
          <LabelList dataKey="valueChange" content={renderCustomizedLabel} />
          {data.map((item, index) => {
            return (
              <Cell key={index} fill={item?.color} stroke={item?.strokeColor} strokeWidth={2} />
            );
          })}
        </Bar>
        {/* <Bar stackId="a" fill="#82ca9d" shape={<TriangleBar />} /> */}
      </BarChart>
    </div>
  );
}

WaterfallPlot.propTypes = {};

export default WaterfallPlot;
