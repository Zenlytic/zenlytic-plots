/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function RechartsLinePlot({
  plotColor = '#8a8a8a',
  width = 300,
  height = 300,
  tickCount = 5,
  minTickGap = 100,
  interval = 'preserveEnd',
  xAxis = {},
  yAxis = {},
  data: lines,
  margin = {
    top: 32,
    left: 24,
    bottom: 40,
    right: 32,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  onUpdateBrush = () => {},
}) {
  const { label: xAxisLabel, format: xAxisFormat, columnIndex: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, columnIndex: yAxisKey } = yAxis;

  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const closeClickTooltip = () => {
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsClickTooltipVisible(false);
    setClickTooltipCoords(null);
  };

  const onBrushEnd = () => {
    setIsDragging(false);

    if (isClickTooltipVisible) {
      return;
    }

    setIsClickTooltipVisible(true);
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      closeClickTooltip();
      return;
    }
    if (refAreaLeft > refAreaRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(refAreaLeft);
      onUpdateBrush({ start: refAreaRight, end: refAreaLeft });
    } else {
      onUpdateBrush({ start: refAreaLeft, end: refAreaRight });
    }
  };

  const data = lines[0];
  return (
    // <ResponsiveContainer width={300} height={100}>
    <div style={{ userSelect: 'none' }}>
      <AreaChart
        height={height}
        width={width}
        data={data}
        margin={margin}
        onMouseDown={(e) => {
          if (isClickTooltipVisible) return false;
          setIsDragging(true);
          setRefAreaLeft(e.activeLabel);
        }}
        onMouseMove={(e) => {
          if (refAreaLeft && isDragging) {
            setRefAreaRight(e.activeLabel);
            setClickTooltipCoords(e.activeCoordinate);
          }
        }}
        // eslint-disable-next-line react/jsx-no-bind
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
          domain={['dataMin', 'dataMax']}
          // tickCount={tickCount}
          name={xAxisLabel}
          minTickGap={minTickGap}
          dataKey={xAxisKey}
          interval={interval}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }
          name={yAxisLabel}>
          <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
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
            />
          }
          formatter={(value) => formatValue(getD3DataFormatter(yAxisFormat, value), value)}
          labelFormatter={(value) => formatValue(getD3DataFormatter(xAxisFormat, value), value)}
        />
        {/* <Tooltip content={<CustomHoverTooltip />} />
            <Tooltip position={clickTooltipCoords} content={<CustomTooltip />} /> */}
        {/* <Brush dataKey={xAxisZenlyticFormat} height={30} stroke={plotColor} /> */}
        {/* <Legend /> */}
        <Area
          type="monotone"
          dataKey={yAxisKey}
          stroke={plotColor}
          strokeWidth={2}
          activeDot={isClickTooltipVisible ? false : { r: 8 }}
          fillOpacity={1}
          fill="url(#colorUv)"
          name={yAxisLabel}
        />
        <ReferenceArea
          x1={refAreaRight}
          x2={refAreaLeft}
          strokeOpacity={0.3}
          isFront
          stroke="gray"
          alwaysShow
        />
      </AreaChart>
    </div>
    // </ResponsiveContainer>
  );
}

RechartsLinePlot.propTypes = {};

export default RechartsLinePlot;
