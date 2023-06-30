/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Cell, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from 'recharts';

import {
  getData,
  getMargin,
  getPaletteColorByIndex,
  getSeriesStrokeColor,
  getXAxis,
  getXAxisDataKey,
  getYAxis,
  getYAxisDataKey,
} from '../../utils/plotConfigGetters';

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
            <Cell key={`cell-${index}`} fill={getPaletteColorByIndex(plotConfig, index)} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}

FunnelPlot.propTypes = {};

export default FunnelPlot;
