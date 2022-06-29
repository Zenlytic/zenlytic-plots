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
  ReferenceArea,
  Label,
} from 'recharts';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function HistogramPlot({
  plotColor = '#8a8a8a',
  width = 300,
  height = 300,
  xAxis = {},
  yAxis = {},
  data = [],
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
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisKey } = yAxis;

  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaValueLeft, setRefAreaValueLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [refAreaValueRight, setRefAreaValueRight] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const closeClickTooltip = () => {
    setRefAreaLeft('');
    setRefAreaRight('');
    setRefAreaValueLeft('');
    setRefAreaValueRight('');
    setIsClickTooltipVisible(false);
    setClickTooltipCoords(null);
  };

  const onBrushEnd = () => {
    setIsDragging(false);

    if (
      isClickTooltipVisible ||
      !refAreaLeft ||
      !refAreaValueLeft ||
      !refAreaRight ||
      !refAreaValueRight
    ) {
      return;
    }

    setIsClickTooltipVisible(true);
    if (refAreaLeft === refAreaRight || refAreaRight === '' || refAreaValueRight === '') {
      closeClickTooltip();
      return;
    }
    if (refAreaValueLeft > refAreaValueRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaValueLeft(refAreaValueRight);
      setRefAreaRight(refAreaLeft);
      setRefAreaValueRight(refAreaValueLeft);
      onUpdateBrush({ start: refAreaValueRight, end: refAreaValueLeft });
    } else {
      onUpdateBrush({ start: refAreaValueLeft, end: refAreaValueRight });
    }
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart
        height={height}
        width={width}
        data={data}
        margin={margin}
        barCategoryGap={10}
        onMouseDown={(e) => {
          if (isClickTooltipVisible) return;
          if (!e?.activeLabel) return;
          if (!e?.activePayload) return;

          if (isDragging) return;
          setIsDragging(true);
          setRefAreaLeft(e.activeLabel);
          setRefAreaValueLeft(e.activePayload[0].payload?.rangeBottom);
        }}
        onMouseMove={(e) => {
          if (refAreaLeft && isDragging && e.activeLabel && e.activeCoordinate) {
            setRefAreaRight(e.activeLabel);
            setRefAreaValueRight(e.activePayload[0].payload?.rangeTop);
            setClickTooltipCoords(e.activeCoordinate);
          }
        }}
        onMouseLeave={(e) => {
          setIsDragging(false);
          if (
            refAreaLeft &&
            refAreaValueLeft &&
            refAreaRight &&
            refAreaValueRight &&
            !isClickTooltipVisible
          ) {
            onBrushEnd();
          }
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseUp={onBrushEnd}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          padding={{ left: 20, right: 20 }}
          allowDuplicatedCategory={false}
          interval="preserveStartEnd"
          name={xAxisLabel}
          dataKey={(ev) =>
            `${formatValue(
              getD3DataFormatter(xAxisFormat, ev.rangeBottom),
              ev.rangeBottom
            )} to ${formatValue(getD3DataFormatter(xAxisFormat, ev.rangeTop), ev.rangeTop)}`
          }
          type="category"
          // tickFormatter={(timeStr) =>
          //   formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          // }
        >
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          name={yAxisLabel}
          width={80}
          dataKey="value"
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
          // labelFormatter={(value) => formatValue(getD3DataFormatter(xAxisFormat, value), value)}
        />
        {/* <Legend /> */}
        <Bar dataKey="value" fill={plotColor} name={yAxisLabel} />
        <ReferenceArea
          x1={refAreaRight}
          x2={refAreaLeft}
          strokeOpacity={0.3}
          isFront
          stroke="gray"
          alwaysShow
        />
      </BarChart>
    </div>
  );
}

HistogramPlot.propTypes = {};

export default HistogramPlot;
