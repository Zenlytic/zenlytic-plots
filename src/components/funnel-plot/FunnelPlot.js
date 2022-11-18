/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Line, FunnelChart, ResponsiveContainer, Tooltip, Funnel, LabelList, Cell } from 'recharts';
import { PLOT_COLORS } from '../../constants/plotConstants';

import {
  getData,
  getMargin,
  getSeriesStrokeColor,
  getXAxis,
  getXAxisDataKey,
  getYAxis,
  getYAxisDataKey,
} from '../../utils/plotConfigGetters';
import GridLines from '../shared/grid-lines/GridLines';
import XAxis from '../shared/x-axis/XAxis';
import YAxis from '../shared/y-axis/YAxis';

function FunnelPlot({ plotConfig = {} }) {
  const xAxisConfig = getXAxis(plotConfig);
  const yAxisConfig = getYAxis(plotConfig);

  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);

  return (
    <ResponsiveContainer>
      <FunnelChart data={data} margin={margin}>
        <Tooltip />
        <Funnel dataKey={yAxisDataKey} nameKey={xAxisDataKey} data={data} isAnimationActive>
          <LabelList position="right" fill="#000" stroke="none" dataKey={xAxisDataKey} />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PLOT_COLORS[index]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}

FunnelPlot.propTypes = {};

export default FunnelPlot;
