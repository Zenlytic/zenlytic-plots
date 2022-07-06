/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Label, Tooltip, XAxis, YAxis } from 'recharts';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function BarPlot({
  plotColor = '#8a8a8a',
  plotSecondaryColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  data = [],
  margin = {
    top: 32,
    left: 112,
    bottom: 40,
    right: 32,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  width = 300,
  height = 300,
  layout = 'vertical',
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisDataKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisDataKey } = yAxis;

  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const closeTooltip = () => {
    setClickTooltipCoords(null);
  };
  const handleBarClick = (event) => {
    if (isClickTooltipVisible) {
      return;
    }
    if (!event) return;
    setClickTooltipCoords(event.activeCoordinate);
  };

  useEffect(() => {
    if (clickTooltipCoords) {
      setIsClickTooltipVisible(true);
    } else {
      setIsClickTooltipVisible(false);
    }
  }, [clickTooltipCoords]);

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart
        margin={margin}
        height={height}
        width={width}
        data={data}
        layout={layout}
        onClick={handleBarClick}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          type="number"
          dataKey={xAxisDataKey}
          name={xAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          }>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          type="category"
          dataKey={yAxisDataKey}
          name={yAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          {/* <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          /> */}
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
              closeClickTooltip={closeTooltip}
            />
          }
          formatter={(value) =>
            formatValue(
              getD3DataFormatter(layout === 'vertical' ? xAxisFormat : yAxisFormat, value),
              value
            )
          }
          labelFormatter={(value) =>
            formatValue(
              getD3DataFormatter(layout === 'vertical' ? yAxisFormat : xAxisFormat, value),
              value
            )
          }
        />

        <Bar
          dataKey={xAxisDataKey}
          name={xAxisLabel}
          // fill={plotSecondaryColor}
          // stroke={plotColor}

          radius={[0, 5, 5, 0]}
          strokeWidth={2}>
          {data.map((entry, index) => {
            console.log('🚀 ~ file: BarPlot.js ~ line 118 ~ {data.map ~ entry', entry);
            return (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || plotSecondaryColor}
                stroke={entry.stroke || plotColor}
              />
            );
          })}
        </Bar>
      </BarChart>
    </div>
  );
}

BarPlot.propTypes = {};

export default BarPlot;
