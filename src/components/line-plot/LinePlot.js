/* eslint-disable react/jsx-filename-extension */
import moment from 'moment';
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

import formatValue, { formatUnixValue, TIME_FORMATS } from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function LinePlot({
  plotColor = '#8a8a8a',
  plotSecondaryColor = '#8a8a8a',
  width = 300,
  height = 300,
  tickCount = 5,
  minTickGap = 100,
  interval = 'preserveEnd',
  xAxis = {},
  yAxis = {},
  data: lines,
  plotId = 'linePlot',
  margin = {
    top: 32,
    left: 24,
    bottom: 40,
    right: 40,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  onUpdateBrush = () => {},
  disableBrush = false,
  disableFollowUps = false,
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisDataKey } = xAxis;
  const xAxisTickFormatter = (timeStr) =>
    formatUnixValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr);

  const newXAxisDataKey = TIME_FORMATS.includes(xAxisFormat)
    ? (d) => {
        if (!d) return null;
        return moment.utc(d[xAxisDataKey]).format('X');
      }
    : xAxisDataKey;

  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisKey } = yAxis;

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
    if (!isDragging) return;
    if (disableFollowUps) return;
    if (isClickTooltipVisible) return;

    setIsDragging(false);
    setIsClickTooltipVisible(true);
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      closeClickTooltip();
      return;
    }
    const formattedRight =
      xAxisFormat === 'date' ? moment.unix(refAreaRight).utc().toDate() : refAreaRight;
    const formattedLeft =
      xAxisFormat === 'date' ? moment.unix(refAreaLeft).utc().toDate() : refAreaLeft;
    if (refAreaLeft > refAreaRight) {
      setRefAreaLeft(formattedRight);
      setRefAreaRight(formattedLeft);
      onUpdateBrush({ start: formattedRight, end: formattedLeft });
    } else {
      onUpdateBrush({ start: formattedLeft, end: formattedRight });
    }
  };

  const gradientId = `colorUv${plotId}`;

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
          if (disableBrush) return;
          if (isClickTooltipVisible) return;
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
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={plotSecondaryColor} stopOpacity={1.0} />
            <stop offset="30%" stopColor={plotSecondaryColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={plotSecondaryColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          domain={['dataMin', 'dataMax']}
          name={xAxisLabel}
          type="number"
          minTickGap={minTickGap}
          dataKey={newXAxisDataKey}
          interval={interval}
          tickFormatter={xAxisTickFormatter}>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          width={80}
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
          wrapperStyle={{ visibility: 'visible', zIndex: 10000 }}
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
          labelFormatter={xAxisTickFormatter}
        />
        <Area
          type="monotone"
          dataKey={yAxisKey}
          stroke={plotColor}
          strokeWidth={2}
          activeDot={isClickTooltipVisible ? false : { r: 8 }}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          name={yAxisLabel}
          dot
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

LinePlot.propTypes = {};

export default LinePlot;
