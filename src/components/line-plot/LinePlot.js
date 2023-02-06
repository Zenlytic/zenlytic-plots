/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { LineChart } from 'recharts';
import useBrush from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import Line from '../shared/Line/Line';
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
  const { isFollowUpMenuOpen } = tooltip;
  const { updateClickedItemId } = tooltipHandlers || {};
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
  });

  const onPlotClick = useCallback(
    (e) => {
      console.log('onPlotClick', e);
      updateClickedItemId(e?.activePayload?.[0]?.payload?.[xAxisDataKey], e?.activeCoordinate);
    },
    [isFollowUpMenuOpen, updateClickedItemId]
  );

  return (
    <PlotContainer>
      <LineChart data={data} margin={margin} onClick={onPlotClick} {...brushEvents}>
        {GeneralChartComponents({
          plotConfig,
          brush,
          brushEvents,
          tooltip,
          TooltipContent,
          tooltipHandlers,
          isFollowUpDisabled,
        })}
        {Line({
          type: 'monotone',
          dataKey: yAxisDataKey,
          stroke: seriesStrokeColor,
          dot: true,
          strokeWidth: 2,
          name: yAxisName,
          isAnimationActive: false,
          valueFormatter: yAxisTickFormatter,
          showDataAnnotations,
        })}
      </LineChart>
    </PlotContainer>
  );
}

LinePlot.propTypes = {};

export default LinePlot;
