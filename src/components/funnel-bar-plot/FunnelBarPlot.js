/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AXIS_COLOR, GRID_COLOR, LABEL_COLOR } from '../../constants/plotConstants';
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
  // We use categories to create the stacked bar
  categories = [],
  layout = 'horizontal',
  disableFollowUps = false,
  isServerSide = false,
}) {
  const { label: xAxisLabel, format: xAxisFormat, dataKey: xAxisKey } = xAxis;
  console.log('🚀 ~ file: FunnelBarPlot.js ~ line 33 ~ xAxisKey', xAxisKey);
  const { label: yAxisLabel, format: yAxisFormat, dataKey: yAxisKey } = yAxis;
  console.log('🚀 ~ file: FunnelBarPlot.js ~ line 35 ~ yAxisKey', yAxisKey);

  // const { convertedData = [], droppedOffData = [] } = data;
  // console.log('🚀 ~ file: FunnelBarPlot.js ~ line 36 ~ convertedData', convertedData);

  // const convertedData = [
  //   {
  //     California: 31351.5,
  //     'New York': 14809.5,
  //     Colorado: 5826.5,
  //     Florida: 5232,
  //     ORDERS_PRODUCT: 'Watering Spritz',
  //   },
  //   {
  //     California: 21351.5,
  //     'New York': 3809.5,
  //     Colorado: 4826.5,
  //     Florida: 5232,
  //     ORDERS_PRODUCT: 'Pool Cleaning',
  //   },
  // ];

  // const droppedOffData = [
  //   {
  //     California: 21351.5,
  //     'New York': 4809.5,
  //     Colorado: 2826.5,
  //     Florida: 2232,
  //     ORDERS_PRODUCT: 'Watering Spritz',
  //   },
  //   {
  //     California: 11351.5,
  //     'New York': 2809.5,
  //     Colorado: 1826.5,
  //     Florida: 1232,
  //     ORDERS_PRODUCT: 'Pool Cleaning',
  //   },
  // ];

  // const newData = [
  //   {
  //     STEP: 'Step 1',
  //     DROPPED_OFF_Ohio: 0,
  //     CONVERTED_Ohio: 2342,
  //   },
  //   {
  //     STEP: 'Step 2',
  //     DROPPED_OFF_California: 4670,
  //     CONVERTED_California: 1454,
  //     DROPPED_OFF_Ohio: 1342,
  //     CONVERTED_Ohio: 1000,
  //   },
  // ];
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
  console.log('🚀 ~ file: FunnelBarPlot.js ~ line 84 ~ newData', newData);

  const colors = [
    '#F785FA',
    '#FFC47F',
    '#F9ED85',
    '#BFF885',
    '#91EBDB',
    '#7ED1FF',
    '#8A80FF',
    '#FC8283',
  ];

  const secondaryColors = [
    '#FFEFFF',
    '#FFF7EA',
    '#FFFDEB',
    '#F5FFEC',
    '#EBFEFB',
    '#E9FBFF',
    '#F1EFFF',
    '#FFEEEE',
  ];

  const [hoveredBarKey, setHoveredBarKey] = useState(null);
  const [activePayload, setActivePayload] = useState(null);

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
            setActivePayload(e.activePayload);
            return;
          }
          setActivePayload(foundPayload);
        }}
        onMouseLeave={(e) => {
          setActivePayload(null);
        }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          name={xAxisLabel}
          tickFormatter={(timeStr) => timeStr}
          tickLine={false}
          axisLine={false}
          tick={{ fill: AXIS_COLOR }}
          stroke={AXIS_COLOR}
        />
        <YAxis
          stroke={GRID_COLOR}
          tick={{ fill: AXIS_COLOR }}
          tickLine={{ stroke: GRID_COLOR }}
          name={yAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          <Label
            fill={AXIS_COLOR}
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip
          cursor
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
              stackId={'a'}
              dataKey={`DROPPED_OFF`}
              fill={secondaryColors[0 % secondaryColors.length]}
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
              strokeWidth={2}
              strokeOpacity={0.7}
            />
            <Bar
              stackId={'a'}
              dataKey={`CONVERTED`}
              fill={colors[0 % colors.length]}
              fillOpacity={1.0}
              radius={[3, 3, 0, 0]}
              strokeWidth={2}
              labe
              strokeOpacity={1.0}>
              <LabelList dataKey="CONVERTED" position="top" fill={LABEL_COLOR} />
            </Bar>
          </>
        )}

        {categories.length &&
          categories.map((category, index) => {
            if (category === xAxisKey) return false;
            return (
              <>
                <Bar
                  stackId={category}
                  onMouseMove={() => setHoveredBarKey(category)}
                  onMouseLeave={() => setHoveredBarKey(null)}
                  dataKey={`DROPPED_OFF_${category}`}
                  fill={secondaryColors[index % secondaryColors.length]}
                  fillOpacity={0.7}
                  radius={[3, 3, 0, 0]}
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
                <Bar
                  stackId={category}
                  onMouseMove={() => setHoveredBarKey(category)}
                  onMouseLeave={() => setHoveredBarKey(null)}
                  dataKey={`CONVERTED_${category}`}
                  fill={colors[index % colors.length]}
                  fillOpacity={1.0}
                  radius={[3, 3, 0, 0]}
                  strokeWidth={2}
                  strokeOpacity={1.0}>
                  <LabelList dataKey="CONVERTED" position="top" fill={LABEL_COLOR} />
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
