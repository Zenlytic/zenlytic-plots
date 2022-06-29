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
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

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
  data,
  margin = {
    top: 32,
    left: 24,
    bottom: 40,
    right: 32,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisDataKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisDataKey } = yAxis;
  const {
    label: categoryAxisLabel,
    format: categoryAxisFormat,
    dataKey: categoryAxisDataKey,
  } = categoryAxis;

  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [activePayloadAtBrush, setActivePayloadAtBrush] = useState([]);

  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const closeClickTooltip = () => {
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsClickTooltipVisible(false);
    setClickTooltipCoords(null);
    setActivePayloadAtBrush([]);
  };

  const onBrushEnd = (event) => {
    setIsDragging(false);

    if (isClickTooltipVisible || !refAreaLeft || !refAreaRight) {
      return;
    }

    setIsClickTooltipVisible(true);
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      closeClickTooltip();
      return;
    }
    setActivePayloadAtBrush(event.activePayload);
    if (refAreaLeft > refAreaRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(refAreaLeft);
      // onUpdateBrush({ start: refAreaRight, end: refAreaLeft });
    } else {
      // onUpdateBrush({ start: refAreaLeft, end: refAreaRight });
    }
  };

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
    // <ResponsiveContainer width={300} height={100}>
    <div style={{ userSelect: 'none' }}>
      <LineChart
        height={height}
        width={width}
        margin={margin}
        // data={lines[0]}
        // margin={PLOT_MARGIN}
        onMouseDown={(e) => {
          if (isClickTooltipVisible) return;
          if (!e?.activeLabel) return;
          if (!e?.activePayload) return;
          if (isDragging) return;
          setIsDragging(true);
          setRefAreaLeft(e.activeLabel);
        }}
        onMouseMove={(e) => {
          if (refAreaLeft && isDragging && e.activeLabel && e.activeCoordinate) {
            setRefAreaRight(e.activeLabel);
            setClickTooltipCoords(e.activeCoordinate);
          }
        }}
        onMouseLeave={(e) => {
          setIsDragging(false);
          if (refAreaLeft && refAreaRight && !isClickTooltipVisible) {
            onBrushEnd();
          }
        }}
        onMouseUp={onBrushEnd}>
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
          dataKey={xAxisDataKey}
          interval={interval}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          type="number"
          dataKey={yAxisDataKey}
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
        <Tooltip
          cursor={!isClickTooltipVisible}
          wrapperStyle={{ visibility: 'visible' }}
          position={isClickTooltipVisible ? clickTooltipCoords : undefined}
          content={
            <TooltipHandler
              CustomHoverTooltip={CustomHoverTooltip}
              CustomClickTooltip={CustomClickTooltip}
              isClickTooltipVisible={isClickTooltipVisible}
              closeClickTooltip={closeClickTooltip}
              customPayload={activePayloadAtBrush}
            />
          }
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
        {/* <Line dataKey={categoryAxisDataKey} /> */}
        {/* <Line dataKey={yAxisDataKey} name={lines[0][0][categoryAxisDataKey]} /> */}
        {data.map((line, index) => {
          return (
            <Line
              activeDot={!isClickTooltipVisible}
              dot
              data={line.data}
              stroke={colors[index % colors.length]}
              dataKey={yAxisDataKey}
              type="monotone"
              strokeWidth={2}
              name={line[categoryAxisDataKey]}
              key={line[categoryAxisDataKey]}
              isAnimationActive={false}
              strokeOpacity={
                line[categoryAxisDataKey] === hoveredLineDataKey
                  ? 1.0
                  : hoveredLineDataKey === null
                  ? 1.0
                  : 0.2
              }
            />
          );
        })}
        {/* <Line dataKey={'ORDERS_TWITTER'} data={line} name={s.name} key={s.name} /> */}
        {/* <Area
          type="monotone"
          dataKey={yAxisDataKey}
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
