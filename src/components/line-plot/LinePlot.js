/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Line, LineChart } from 'recharts';
import useBrush from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';

import {
  getAxisFormat,
  getData,
  getMargin,
  getSeriesShowDataAnnotations,
  getSeriesStrokeColor,
  getXAxisDataKey,
  getYAxisDataKey,
  getYAxisName,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import DataAnnotation from '../shared/data-annotation/DataAnnotation';

function LinePlot({
  plotConfig = {},
  onBrushUpdate = () => {},
  TooltipContent = () => {},
  isFollowUpDisabled = false,
}) {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const xAxisFormat = getAxisFormat(plotConfig, xAxisDataKey);
  const yAxisName = getYAxisName(plotConfig);

  const yAxisDataKey = getYAxisDataKey(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);

  const [tooltip, tooltipHandlers] = useTooltip();
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
  });

  return (
    <PlotContainer>
      <LineChart data={data} margin={margin} {...brushEvents}>
        {GeneralChartComponents({
          plotConfig,
          brush,
          brushEvents,
          tooltip,
          TooltipContent,
          tooltipHandlers,
          isFollowUpDisabled,
        })}
        <Line
          type="monotone"
          dataKey={yAxisDataKey}
          stroke={seriesStrokeColor}
          dot
          strokeWidth={2}
          name={yAxisName}
          isAnimationActive={false}
          label={
            showDataAnnotations ? <DataAnnotation valueFormatter={yAxisTickFormatter} /> : undefined
          }
        />
      </LineChart>
    </PlotContainer>
  );
}

LinePlot.propTypes = {};

export default LinePlot;
