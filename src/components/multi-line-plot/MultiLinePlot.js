/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { LineChart } from 'recharts';
import { PLOT_COLORS, PLOT_SECONDARY_COLORS } from '../../constants/plotConstants';
import useBrush, { BRUSH_SELECTION_TYPES } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import { overrideAxisConfig } from '../../utils/overrideAxisConfig';

import {
  getAxisFormat,
  getCategoryAxisDataKey,
  getCategoryAxisFormatter,
  getCategoryValueAxes,
  getCategoryValueAxisByDataKey,
  getData,
  getIsDataPivoted,
  getMargin,
  getSeriesHiddenColumns,
  getSeriesShowDataAnnotations,
  getTickFormatterFromDataKey,
  getUniqueValuesOfDataKey,
  getXAxisDataKey,
  getYAxis,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Line from '../shared/Line/Line';

function PivotedMultiLinePlot({ plotConfig = {} }) {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const nameFormatter = getCategoryAxisFormatter(plotConfig);
  return uniqueValuesOfCategoryKey.map((value, index) =>
    Line({
      id: value,
      dataKey: value,
      name: nameFormatter(value),
      key: value,
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      type: 'monotone',
      strokeWidth: 2,
      dot: true,
      isAnimationActive: false,
      showDataAnnotations,
      valueFormatter: yAxisTickFormatter,
    })
  );
}

function NonPivotedMultiLinePlot({ plotConfig }) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const seriesHiddenColumns = getSeriesHiddenColumns(plotConfig);
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

  const yAxisConfig = getYAxis(plotConfig);

  const customValueFormatter = (value, dataKey) => {
    const formatter = isDataPivoted
      ? getYAxisTickFormatter(plotConfig)
      : getCategoryValueAxisByDataKey(plotConfig, dataKey).tickFormatter;
    return formatter(value);
  };

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
          yAxisConfig: overrideAxisConfig(yAxisConfig, {
            dataKey: isDataPivoted ? undefined : yAxisConfig.dataKey,
          }),
          customValueFormatter,
        })}
        {isDataPivoted && PivotedMultiLinePlot({ plotConfig })}
        {!isDataPivoted && NonPivotedMultiLinePlot({ plotConfig })}
      </LineChart>
    </PlotContainer>
  );
}

MultiLinePlot.propTypes = {};

export default MultiLinePlot;
