/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BarChart } from 'recharts';
import useBrush from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import Bar from '../shared/bar/Bar';

import {
  getAxisFormat,
  getData,
  getFormatter,
  getMargin,
  getSeriesFillColor,
  getSeriesStrokeColor,
  getTickFormatterFromDataKey,
  getXAxis,
  getXAxisDataKey,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

function HistogramPlot({
  plotConfig = {},
  onBrushUpdate = () => {},
  TooltipContent = false,
  isFollowUpDisabled = false,
}) {
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const xAxisFormat = getAxisFormat(plotConfig, xAxisDataKey);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const seriesFillColor = getSeriesFillColor(plotConfig);
  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);

  const yAxisTickFormatter = getFormatter('decimal');

  const [tooltip, tooltipHandlers] = useTooltip();
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
  });

  // <XAxis dataKey={'rangeBottom'} name="MEMMMM" category="number" />
  // <YAxis dataKey="value" name="Freq" category="number" />

  const customLabelFormatter = (value, payload) => {
    const hoveredBar = payload[0] || {};
    const { payload: hoveredBarPayload = {} } = hoveredBar;
    const { rangeTop, rangeBottom } = hoveredBarPayload;
    const formatter = getTickFormatterFromDataKey(plotConfig, xAxisDataKey);
    return `${formatter(rangeBottom)} - ${formatter(rangeTop)}`;
  };

  return (
    <PlotContainer>
      <BarChart data={data} margin={margin} {...brushEvents}>
        {GeneralChartComponents({
          plotConfig,
          brush,
          brushEvents,
          tooltip,
          TooltipContent,
          tooltipHandlers,
          isFollowUpDisabled,
          xAxisConfig: {
            ...xAxisConfig,
            type: 'number',
            dataKey: 'rangeBottom',
          },
          yAxisConfig: {
            name: 'Frequency',
            type: 'number',
            dataKey: 'value',
            tickFormatter: yAxisTickFormatter,
          },
          customLabelFormatter,
        })}
        {Bar({
          dataKey: 'value',
          fill: seriesFillColor,
          stroke: seriesStrokeColor,
          name: 'Frequency',
        })}
      </BarChart>
    </PlotContainer>
  );
}

HistogramPlot.propTypes = {};

export default HistogramPlot;
