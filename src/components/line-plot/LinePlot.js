/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { LineChart } from 'recharts';
import useBrush from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import Line from '../shared/Line/Line';
import {
  getAxisFormat,
  getData,
  getIsSplitAxes,
  getMargin,
  getSecondYAxisDataKey,
  getSecondYAxisId,
  getSecondYAxisName,
  getSecondYAxisTickFormatter,
  getSeriesShowDataAnnotations,
  getSeriesStrokeColor,
  getXAxisDataKey,
  getYAxis,
  getYAxisDataKey,
  getYAxisDomainWithFallback,
  getYAxisId,
  getYAxisName,
  getYAxisPlotOptions,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import colors from '../../constants/colors';

function LinePlot({
  plotConfig = {},
  onBrushUpdate = () => {},
  TooltipContent = () => {},
  isFollowUpDisabled = false,
}) {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const xAxisFormat = getAxisFormat(plotConfig, xAxisDataKey);
  const yAxisName = getYAxisName(plotConfig);
  const yAxisId = getYAxisId(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const secondYAxisName = getSecondYAxisName(plotConfig);
  const secondYAxisDataKey = getSecondYAxisDataKey(plotConfig);
  const secondYAxisTickFormatter = getSecondYAxisTickFormatter(plotConfig);
  const secondYAxisId = getSecondYAxisId(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);

  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);
  const isSplitAxes = getIsSplitAxes(plotConfig);

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
          useLegend: isSplitAxes,
          isSplitAxes,
        })}
        {Line({
          yAxisId,
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
        {secondYAxisDataKey &&
          Line({
            yAxisId: secondYAxisId,
            type: 'monotone',
            dataKey: secondYAxisDataKey,
            stroke:
              seriesStrokeColor === colors.light_blue[300]
                ? colors.red[300]
                : colors.light_blue[300],
            dot: true,
            strokeWidth: 2,
            name: secondYAxisName,
            isAnimationActive: false,
            valueFormatter: secondYAxisTickFormatter,
            showDataAnnotations,
          })}
      </LineChart>
    </PlotContainer>
  );
}

LinePlot.propTypes = {};

export default LinePlot;
