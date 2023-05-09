/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { LineChart } from 'recharts';
import colors from '../../constants/colors';
import useBrush from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
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
  getXAxis,
  getXAxisDataKey,
  getXAxisInterval,
  getYAxisDataKey,
  getYAxisId,
  getYAxisName,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Line from '../shared/Line/Line';

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

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  return (
    <PlotContainer ref={ref}>
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
          xAxisConfig: { ...xAxisConfig, interval: xAxisInterval },
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
