/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Label, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import {
  DEFAULT_AXIS_COLOR,
  DEFAULT_CARTESIAN_GRID_COLOR,
  DEFAULT_LABEL_PROPS,
  DEFAULT_NO_X_AXIS_PLOT_MARGIN,
  DEFAULT_TICK_PROPS,
  DEFAULT_X_AXIS_HEIGHT,
  DEFAULT_Y_AXIS_WIDTH,
  HIGHTLIGHT_BAR_COLOR,
  PLOT_COLORS,
  PLOT_SECONDARY_COLORS,
} from '../../constants/plotConstants';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

const createBars = (data) => {};

function FunnelBarPlot({
  plotColor = '#8a8a8a',
  plotSecondaryColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  categoryAxis = {},
  onBarClick = () => {},
  data = {},
  margin = DEFAULT_NO_X_AXIS_PLOT_MARGIN,
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  width = 300,
  height = 300,
  // We use categories to create the stacked bar
  categories = [],
  layout = 'horizontal',
  disableFollowUps = false,
  isServerSide = false,
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisKey } = yAxis;

  const newData = [
    {
      STEP: 'Step 1',
      DROPPED_OFF: 0,
      CONVERTED: 2342,
    },
    {
      STEP: 'Step 2',
      DROPPED_OFF: 1342,
      CONVERTED: 1000,
    },
  ];

  const plotColors = PLOT_COLORS;
  const secondaryColors = PLOT_SECONDARY_COLORS;

  const [hoveredBarKey, setHoveredBarKey] = useState(null);
  const [activePayload, setActivePayload] = useState([]);

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart
        reverseStackOrder
        margin={margin}
        height={height}
        width={width}
        data={data}
        barGap={6}
        onMouseMove={(e) => {
          const foundPayload = e.activePayload?.filter((bar) => {
            return bar.dataKey === hoveredBarKey;
          });
          if (!foundPayload) return;
          if (!foundPayload.length) {
            setActivePayload([]);
            return;
          }
          setActivePayload(foundPayload);
        }}
        onMouseLeave={(e) => {
          setActivePayload([]);
        }}>
        <CartesianGrid stroke={DEFAULT_CARTESIAN_GRID_COLOR} vertical={false} />
        <XAxis
          height={DEFAULT_X_AXIS_HEIGHT}
          stroke={DEFAULT_AXIS_COLOR}
          tick={DEFAULT_TICK_PROPS}
          dataKey={xAxisKey}
          name={xAxisLabel}
          tickFormatter={(timeStr) => timeStr}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={DEFAULT_AXIS_COLOR}
          width={DEFAULT_Y_AXIS_WIDTH}
          tick={DEFAULT_TICK_PROPS}
          name={yAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          <Label {...DEFAULT_LABEL_PROPS} value={yAxisLabel} position="left" angle={-90} />
        </YAxis>
        <Tooltip
          cursor={{ fill: HIGHTLIGHT_BAR_COLOR }}
          wrapperStyle={{ visibility: 'visible', zIndex: 10000 }}
          content={
            <TooltipHandler
              CustomHoverTooltip={CustomHoverTooltip}
              CustomClickTooltip={CustomClickTooltip}
              customPayload={activePayload}
            />
          }
          formatter={(value) => formatValue(getD3DataFormatter(yAxisFormat, value), value)}
          labelFormatter={(value) => formatValue(getD3DataFormatter(xAxisFormat, value), value)}
        />

        {!categories.length && (
          <>
            <Bar
              onMouseMove={() => setHoveredBarKey(`DROPPED_OFF`)}
              onMouseLeave={() => setHoveredBarKey(null)}
              stackId={'a'}
              dataKey={`DROPPED_OFF`}
              fill={plotSecondaryColor}
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
              name="Dropped Off"
            />
            <Bar
              onMouseMove={() => setHoveredBarKey(`CONVERTED`)}
              onMouseLeave={() => setHoveredBarKey(null)}
              stackId={'a'}
              name="Converted"
              dataKey={`CONVERTED`}
              fill={plotColor}
              fillOpacity={1.0}
              radius={[0, 0, 3, 3]}>
              <LabelList
                offset={16}
                dataKey="CONVERTED"
                position="top"
                fill={colors.gray[500]}
                fontWeight={fontWeights.medium}
                fontSize={fontSizes.xs}
                formatter={(value) => {
                  return formatValue(getD3DataFormatter(yAxisFormat, value), value);
                }}
              />
            </Bar>
          </>
        )}

        {categories.length &&
          categories.map((category, index) => {
            if (category === xAxisKey) return false;
            return (
              <>
                <Bar
                  onMouseMove={() => setHoveredBarKey(`DROPPED_OFF_${category}`)}
                  onMouseLeave={() => setHoveredBarKey(null)}
                  fillOpacity={
                    `DROPPED_OFF_${category}` === hoveredBarKey
                      ? 1.0
                      : hoveredBarKey === null
                      ? 1.0
                      : 0.3
                  }
                  name={`Dropped Off - ${category}`}
                  stackId={category}
                  dataKey={`DROPPED_OFF_${category}`}
                  fill={secondaryColors[index % secondaryColors.length]}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  onMouseMove={() => setHoveredBarKey(`CONVERTED_${category}`)}
                  onMouseLeave={() => setHoveredBarKey(null)}
                  fillOpacity={
                    `CONVERTED_${category}` === hoveredBarKey
                      ? 1.0
                      : hoveredBarKey === null
                      ? 1.0
                      : 0.3
                  }
                  stackId={category}
                  dataKey={`CONVERTED_${category}`}
                  name={`Converted - ${category}`}
                  fill={plotColors[index % plotColors.length]}
                  radius={[0, 0, 3, 3]}>
                  <LabelList
                    offset={16}
                    dataKey={`CONVERTED_${category}`}
                    position="top"
                    fill={colors.gray[500]}
                    fontWeight={fontWeights.medium}
                    fontSize={fontSizes.xs}
                    formatter={(timeStr) =>
                      formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
                    }
                  />
                </Bar>
              </>
            );
          })}
      </BarChart>
    </div>
  );
}

FunnelBarPlot.propTypes = {};

export default FunnelBarPlot;
