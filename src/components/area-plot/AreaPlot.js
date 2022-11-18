/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PLOT_COLORS, PLOT_SECONDARY_COLORS } from '../../constants/plotConstants';

import {
  getCategoryAxisDataKey,
  getCategoryValueAxes,
  getData,
  getIsDataPivoted,
  getMargin,
  getUniqueValuesOfDataKey,
  getXAxis,
  getXAxisDataKey,
  getYAxisDataKey,
} from '../../utils/plotConfigGetters';
import GridLines from '../shared/grid-lines/GridLines';
import XAxis from '../shared/x-axis/XAxis';
import YAxis from '../shared/y-axis/YAxis';

import ZenlyticLegend from '../zenlytic-legend/ZenlyticLegend';

function AreaPlot({ plotConfig = {} }) {
  const xAxisConfig = getXAxis(plotConfig);

  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);

  const yAxisDataKey = getYAxisDataKey(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);
  return (
    <ResponsiveContainer>
      <AreaChart margin={margin} data={data}>
        {GridLines()}

        {XAxis({ ...xAxisConfig })}
        {YAxis({})}

        {isDataPivoted &&
          uniqueValuesOfCategoryKey.map((uniqueValueOfCategoryKey, index) => {
            return (
              <Area
                stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
                fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
                dataKey={uniqueValueOfCategoryKey}
                type="monotone"
                strokeWidth={2}
                name={uniqueValueOfCategoryKey}
                key={uniqueValueOfCategoryKey}
                stackId="1"
              />
            );
          })}

        {/* {isDataPivoted &&
          data.map((series, index) => {
            return (
              <Area
                data={series.data}
                stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
                dataKey={yAxisDataKey}
                type="monotone"
                strokeWidth={2}
                name={series.name}
                key={series.name}
                stackId="1"
              />
            );
          })} */}

        {!isDataPivoted &&
          categoryValueAxes.map((axis, index) => (
            <Area
              type="monotone"
              dataKey={axis.dataKey}
              name={axis.name}
              key={axis.name}
              fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
              stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
              strokeWidth={2}
              stackId="1"
            />
          ))}
        <Tooltip />

        {ZenlyticLegend({
          margin,
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

AreaPlot.propTypes = {};

export default AreaPlot;
