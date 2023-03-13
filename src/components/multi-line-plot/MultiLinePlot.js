/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { LineChart } from 'recharts';
import { PLOT_COLORS, PLOT_SECONDARY_COLORS } from '../../constants/plotConstants';
import useBrush, { BRUSH_SELECTION_TYPES } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';

import {
  getAxisFormat,
  getCategoryValueAxes,
  getData,
  getIsDataPivoted,
  getMargin,
  getSeriesHiddenColumns,
  getSeriesShowDataAnnotations,
  getTickFormatterFromDataKey,
  getXAxisDataKey,
  getYAxisDataKey,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Line from '../shared/Line/Line';

function PivotedMultiLinePlot({ plotConfig }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const data = getData(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);
  return data.map((series, index) => {
    return Line({
      dot: true,
      data: series.data,
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      dataKey: yAxisDataKey,
      type: 'monotone',
      strokeWidth: 2,
      name: series.name,
      key: series.name,
      isAnimationActive: false,
      showDataAnnotations,
      valueFormatter: yAxisTickFormatter,
    });
  });
}

function NonPivotedMultiLinePlot({ plotConfig }) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const seriesHiddenColumns = getSeriesHiddenColumns(plotConfig);
  console.log(seriesHiddenColumns);
  return categoryValueAxes
    .filter((axis) => {
      return !seriesHiddenColumns.includes(axis.dataKey);
    })
    .map((axis, index) =>
      Line({
        type: 'monotone',
        dataKey: axis.dataKey,
        name: axis.name,
        key: axis.name,
        fill: PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length],
        stroke: PLOT_COLORS[index % PLOT_COLORS.length],
        dot: true,
        strokeWidth: 2,
        isAnimationActive: false,
        showDataAnnotations,
        valueFormatter: getTickFormatterFromDataKey(plotConfig, axis.dataKey),
      })
    );
}

function MultiLinePlot({
  plotConfig = {},
  TooltipContent = () => {},
  onBrushUpdate = () => {},
  isFollowUpDisabled = false,
}) {
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);

  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const xAxisFormat = getAxisFormat(plotConfig, xAxisDataKey);

  const [tooltip, tooltipHandlers] = useTooltip();
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
    brushSelectionType: BRUSH_SELECTION_TYPES.RANGE_AND_ITEMS,
  });

  return (
    <PlotContainer>
      <LineChart data={data} margin={margin} {...brushEvents}>
        {GeneralChartComponents({
          plotConfig,
          brush,
          useLegend: true,
          brushEvents,
          isFollowUpDisabled,
          tooltip,
          TooltipContent,
          tooltipHandlers,
        })}
        {isDataPivoted && PivotedMultiLinePlot({ plotConfig })}
        {!isDataPivoted && NonPivotedMultiLinePlot({ plotConfig })}
      </LineChart>
    </PlotContainer>
  );
}

MultiLinePlot.propTypes = {};

export default MultiLinePlot;
