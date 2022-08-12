/* eslint-disable react/jsx-filename-extension */
import moment from 'moment';
import React, { useState } from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
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
  onUpdateBrush = () => {},
  disableBrush = false,
  data,
  margin = {
    top: 32,
    left: 32,
    bottom: 40,
    right: 32,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  isServerSide,
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
  const [activePayloadAtBrush, setActivePayloadAtBrush] = useState(null);

  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const closeClickTooltip = () => {
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsClickTooltipVisible(false);
    setClickTooltipCoords(null);
    setActivePayloadAtBrush(null);
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
    if (!event || !event.activePayload) {
      return;
    }
    setActivePayloadAtBrush(event.activePayload);
    const formattedRight = moment.unix(refAreaRight).utc().toDate();

    const formattedLeft = moment.unix(refAreaLeft).utc().toDate();

    if (refAreaLeft > refAreaRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(refAreaLeft);

      onUpdateBrush({ start: formattedRight, end: formattedLeft });
    } else {
      onUpdateBrush({ start: formattedLeft, end: formattedRight });
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
          if (disableBrush) return;
          if (isClickTooltipVisible) return;
          if (!e?.activeLabel) return;
          if (!e?.activePayload) return;
          if (isDragging) return;
          setIsDragging(true);
          setRefAreaLeft(e.activeLabel);
          setRefAreaRight(e.activeLabel);
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
          domain={['dataMin', 'dataMax']}
          type="number"
          scle="time"
          minTickGap={minTickGap}
          allowDuplicatedCategory={false}
          tickFormatter={(timeStr) => moment.unix(timeStr).utc().format('MM/DD/YY')}
          dataKey={(d) => {
            if (!d) return null;
            return moment.utc(d[xAxisDataKey]).format('X');
          }}
          interval={interval}>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          type="number"
          dataKey={yAxisDataKey}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          <Label value={yAxisLabel} position="left" angle={-90} style={{ textAnchor: 'middle' }} />
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
              customPayload={activePayloadAtBrush}
            />
          }
          formatter={(value) => formatValue(getD3DataFormatter(yAxisFormat, value), value)}
          labelFormatter={(value) => {
            return moment.unix(value).utc().format('MM/DD/YY');
          }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign={isServerSide ? 'top' : 'middle'}
          iconType="circle"
          iconSize={12}
          wrapperStyle={{
            paddingLeft: '16px',
            paddingBottom: margin.bottom,
          }}
          onMouseEnter={onLegendItemHover}
          onMouseLeave={onLegendItemLeave}
          isAnimationActive={!isServerSide}
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
