/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
  Label,
  Area,
  ReferenceArea,
} from 'recharts';
import moment from 'moment';
import formatValue from '../../utils/formatValue';
import { PLOT_MARGIN } from '../../constants/plotConstants';
import getD3DataFormatter from '../../utils/getD3DataFormatter';

function MultiLinePlot({
  plotColor = '#8a8a8a',
  width = 300,
  height = 300,
  tickCount = 5,
  minTickGap = 100,
  interval = 'preserveEnd',
  xAxis = {},
  yAxis = {},
  categoryAxis = {},
  data: lines,
  margin = PLOT_MARGIN,
}) {
  console.log('🚀 ~ file: MultiLinePlot.js ~ line 35 ~ lines', lines);
  const { label: xAxisLabel, format: xAxisFormat, columnIndex: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, columnIndex: yAxisKey } = yAxis;
  const {
    label: categoryAxisLabel,
    format: categoryAxisFormat,
    columnIndex: categoryAxisKey,
  } = categoryAxis;

  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const onBrushEnd = () => {
    setIsDragging(false);
    setIsClickTooltipVisible(true);

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      setIsClickTooltipVisible(false);
      setClickTooltipCoords(null);
    }
    if (refAreaLeft > refAreaRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(refAreaLeft);
    }
  };

  const colors = ['red', 'green', 'blue'];

  return (
    // <ResponsiveContainer width={300} height={100}>
    <div style={{ userSelect: 'none' }}>
      <LineChart
        height={height}
        width={width}
        margin={margin}
        // data={lines[0]}
        // margin={PLOT_MARGIN}
        // onMouseDown={(e) => {
        //   setIsDragging(true);
        //   setRefAreaLeft(e.activeLabel);
        // }}
        // onMouseMove={(e) => {
        //   if (refAreaLeft && isDragging) {
        //     setRefAreaRight(e.activeLabel);
        //     setClickTooltipCoords(e.activeCoordinate);
        //   }
        // }}
        // eslint-disable-next-line react/jsx-no-bind
        // onMouseUp={onBrushEnd}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={plotColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={plotColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          // height={70}
          // tickCount={tickCount}
          type="category"
          minTickGap={minTickGap}
          allowDuplicatedCategory={false}
          dataKey={xAxisKey}
          interval={interval}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          type="number"
          dataKey={yAxisKey}
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
        {/* <Tooltip content={<CustomHoverTooltip />} />
            <Tooltip position={clickTooltipCoords} content={<CustomTooltip />} /> */}
        {/* <Brush dataKey={xAxisZenlyticFormat} height={30} stroke={plotColor} /> */}
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          wrapperStyle={{
            paddingLeft: '16px',
          }}
        />
        {/* <Line dataKey={categoryAxisKey} /> */}
        {/* <Line dataKey={yAxisKey} name={lines[0][0][categoryAxisKey]} /> */}
        {lines.map((line, index) => (
          <Line
            data={line}
            stroke={colors[index]}
            dataKey={yAxisKey}
            type="monotone"
            strokeWidth={2}
            name={line[0][categoryAxisKey]}
          />
        ))}
        {/* <Line dataKey={'ORDERS_TWITTER'} data={line} name={s.name} key={s.name} /> */}
        {/* <Area
          type="monotone"
          dataKey={yAxisKey}
          stroke={plotColor}
          strokeWidth={2}
          activeDot={{ r: 8 }}
          fillOpacity={1}
          fill="url(#colorUv)"
        /> */}
        <ReferenceArea
          x1={refAreaRight}
          x2={refAreaLeft}
          strokeOpacity={0.3}
          isFront
          stroke="gray"
          alwaysShow
        />
      </LineChart>
    </div>
    // </ResponsiveContainer>
  );
}

MultiLinePlot.propTypes = {};

export default MultiLinePlot;
