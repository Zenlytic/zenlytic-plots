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

  const colors = [
    '#7ED1FF',
    '#8A80FF',
    '#FC8283',
    '#F785FA',
    '#FFC47F',
    '#F9ED85',
    '#BFF885',
    '#91EBDB',
  ];

  const secondaryColors = [
    '#E9FBFF',
    '#F1EFFF',
    '#FFEEEE',
    '#FFEFFF',
    '#FFF7EA',
    '#FFFDEB',
    '#F5FFEC',
    '#EBFEFB',
  ];

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
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          name={xAxisLabel}
          tickFormatter={(timeStr) => timeStr}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#A6A6A6', fontWeight: 'medium', fontSize: '10px' }}
          stroke={AXIS_COLOR}
        />
        <YAxis
          stroke={GRID_COLOR}
          tick={{ fill: '#A6A6A6', fontWeight: 'medium', fontSize: '10px' }}
          tickLine={{ stroke: GRID_COLOR }}
          name={yAxisLabel}
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }>
          <Label
            fill={AXIS_COLOR}
            value={yAxisLabel}
            position="insideLeft"
            fontSize="12px"
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
                dataKey="CONVERTED"
                position="top"
                fill="#737373"
                fontWeight="medium"
                fontSize="12px"
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
                  fill={colors[index % colors.length]}
                  radius={[0, 0, 3, 3]}>
                  <LabelList
                    dataKey={`CONVERTED_${category}`}
                    position="top"
                    fill="#737373"
                    fontWeight="medium"
                    fontSize="12px"
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
