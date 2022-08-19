/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Label, Legend, Tooltip, XAxis, YAxis } from 'recharts';
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

  // const dataa = [
  //   {
  //     converted: {
  //       California: 31351.5,
  //       'New York': 14809.5,
  //       Colorado: 5826.5,
  //       Florida: 5232,
  //       ORDERS_PRODUCT: 'Watering Spritz',
  //     },
  //     dropOff: {
  //       California: 11351.5,
  //       'New York': 4809.5,
  //       Colorado: 2826.5,
  //       Florida: 2232,
  //       ORDERS_PRODUCT: 'Watering Spritz',
  //     },
  //   },
  //   {
  //     converted: {
  //       California: 31351.5,
  //       'New York': 14809.5,
  //       Colorado: 5826.5,
  //       Florida: 5232,
  //       ORDERS_PRODUCT: 'Pool Cleaner',
  //     },
  //     dropOff: {
  //       California: 11351.5,
  //       'New York': 4809.5,
  //       Colorado: 2826.5,
  //       Florida: 2232,
  //       ORDERS_PRODUCT: 'PoolCleaner',
  //     },
  //   },
  // ];
  // console.log('🚀 ~ file: FunnelBarPlot.js ~ line 69 ~ dataa', dataa);

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

  const secondaryColors = [
    '#4dbfff',
    '#ffd34b',
    '#f355f6',
    '#ffad4d',
    '#f6e655',
    '#a6f556',
    '#68e3cd',
    '#5b4dff',
    '#fa5252',
  ];

  const [hoveredBarKey, setHoveredBarKey] = useState(null);
  const [activePayload, setActivePayload] = useState(null);

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart
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
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey={xAxisKey} name={xAxisLabel} tickFormatter={(timeStr) => timeStr}>
          <Label value={xAxisLabel} offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis
          name={yAxisLabel}
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
              dataKey={`CONVERTED`}
              fill={secondaryColors[0 % secondaryColors.length]}
              stroke={colors[0 % colors.length]}
              fillOpacity={1.0}
              radius={[3, 3, 0, 0]}
              strokeWidth={2}
              strokeOpacity={1.0}
            />
            <Bar
              stackId={'a'}
              dataKey={`DROPPED_OFF`}
              fill={'lightgray'}
              stroke={'red'}
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
              strokeWidth={2}
              strokeOpacity={0.7}
            />
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
                  dataKey={`CONVERTED_${category}`}
                  fill={secondaryColors[index % secondaryColors.length]}
                  stroke={colors[index % colors.length]}
                  fillOpacity={
                    category === hoveredBarKey ? 1.0 : hoveredBarKey === null ? 1.0 : 0.2
                  }
                  radius={[3, 3, 0, 0]}
                  strokeWidth={2}
                  strokeOpacity={
                    category === hoveredBarKey ? 1.0 : hoveredBarKey === null ? 1.0 : 0.2
                  }
                />
                <Bar
                  stackId={category}
                  onMouseMove={() => setHoveredBarKey(category)}
                  onMouseLeave={() => setHoveredBarKey(null)}
                  dataKey={`DROPPED_OFF_${category}`}
                  fill={'lightgray'}
                  stroke={'red'}
                  fillOpacity={
                    category === hoveredBarKey ? 0.7 : hoveredBarKey === null ? 0.7 : 0.2
                  }
                  radius={[3, 3, 0, 0]}
                  strokeWidth={2}
                  strokeOpacity={
                    category === hoveredBarKey ? 0.7 : hoveredBarKey === null ? 0.7 : 0.2
                  }
                />
              </>
            );
          })}
      </BarChart>
    </div>
  );
}

FunnelBarPlot.propTypes = {};

export default FunnelBarPlot;
