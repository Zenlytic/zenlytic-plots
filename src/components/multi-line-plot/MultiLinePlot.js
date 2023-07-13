/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { LineChart } from 'recharts';
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
  getPaletteColorByIndex,
  getSecondaryPaletteColorByIndex,
  getSeriesHiddenColumns,
  getSeriesShowDataAnnotations,
  getTickFormatterFromDataKey,
  getUniqueValuesOfDataKey,
  getXAxis,
  getXAxisDataKey,
  getXAxisInterval,
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

  return uniqueValuesOfCategoryKey.map((value, index) => {
    return Line({
      id: value,
      dataKey: value,
      name: nameFormatter(value),
      key: value,
      stroke: getPaletteColorByIndex(plotConfig, index, value),
      type: 'monotone',
      strokeWidth: 2,
      dot: true,
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
  return categoryValueAxes
    .filter((axis) => {
      return !seriesHiddenColumns.includes(axis.dataKey);
    })
    .map((axis, index) => {
      return Line({
        type: 'monotone',
        dataKey: axis.dataKey,
        name: axis.name,
        key: axis.name,
        fill: getSecondaryPaletteColorByIndex(plotConfig, index, axis.dataKey),
        stroke: getPaletteColorByIndex(plotConfig, index, axis.dataKey),
        dot: true,
        strokeWidth: 2,
        isAnimationActive: false,
        showDataAnnotations,
        valueFormatter: getTickFormatterFromDataKey(plotConfig, axis.dataKey),
      });
    });
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

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  return (
    <PlotContainer ref={ref}>
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
          xAxisConfig: { ...xAxisConfig, interval: xAxisInterval },
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
