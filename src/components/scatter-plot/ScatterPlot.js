/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import useBrush, { BRUSH_DIRECTIONS } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';

import {
  getAxisFormat,
  getData,
  getMargin,
  getSeriesStrokeColor,
  getXAxis,
  getXAxisDataKey,
  getXAxisInterval,
  getYAxisDataKey,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

function ScatterPlot({
  plotConfig = {},
  onBrushUpdate = () => {},
  TooltipContent = false,
  isFollowUpDisabled = false,
}) {
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);
  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);

  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const xAxisFormat = getAxisFormat(plotConfig, xAxisDataKey);

  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const yAxisFormat = getAxisFormat(plotConfig, yAxisDataKey);

  const [tooltip, tooltipHandlers] = useTooltip();
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    brushDirection: BRUSH_DIRECTIONS.BOTH,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
    yAxisDataKey,
    yAxisFormat,
  });

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  // const data = [
  //   { x: 100, y: 200, z: 200 },
  //   { x: 120, y: 100, z: 260 },
  //   { x: 170, y: 300, z: 400 },
  //   { x: 140, y: 250, z: 280 },
  //   { x: 150, y: 400, z: 500 },
  //   { x: 110, y: 280, z: 200 },
  // ];

  return (
    <PlotContainer>
      <ScatterChart margin={margin} {...brushEvents}>
        {/* <XAxis type="number" dataKey="ORDERS_AVERAGE_ORDER_VALUE" name="stature" />
        <YAxis type="number" dataKey="ORDERS_MEDIAN_ORDER_VALUE" name="weight" /> */}
        {GeneralChartComponents({
          plotConfig,
          brush,
          brushEvents,
          TooltipContent,
          tooltipHandlers,
          tooltip,
          isFollowUpDisabled,
          xAxisConfig: { ...xAxisConfig },
        })}
        <Scatter name="the hardest" data={data} fill={seriesStrokeColor} />
      </ScatterChart>
    </PlotContainer>
  );
}

ScatterPlot.propTypes = {};

export default ScatterPlot;
