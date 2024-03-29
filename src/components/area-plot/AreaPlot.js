/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { AreaChart } from 'recharts';
import {
  DATA_CHANGE_TYPES,
  DATA_CHANGE_TYPE_TO_STACK_OFFSET_MAPPING,
} from '../../constants/plotConstants';
import useBrush, { BRUSH_SELECTION_TYPES } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import { getRatioSafe } from '../../utils/numberUtils';
import { overrideAxisConfig } from '../../utils/overrideAxisConfig';
import {
  getAreaPlotDataAnnotationsChangeType,
  getAreaPlotDataChangeType,
  getAxisFormat,
  getCategoryAxisDataKey,
  getCategoryAxisFormatter,
  getCategoryValueAxes,
  getCategoryValueAxisByDataKey,
  getData,
  getFormatter,
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
import { Area } from './components/area/Area';

function PivotedAreaPlot({ plotConfig }) {
  const data = getData(plotConfig);
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);
  const nameFormatter = getCategoryAxisFormatter(plotConfig);

  const dataAnnotationsChangeType = getAreaPlotDataAnnotationsChangeType(plotConfig);
  return uniqueValuesOfCategoryKey.map((uniqueValueOfCategoryKey, index) =>
    Area({
      type: 'monotone',
      stackId: '1',
      dot: true,
      strokeWidth: 2,
      stroke: getPaletteColorByIndex(plotConfig, index),
      fill: getSecondaryPaletteColorByIndex(plotConfig, index),
      dataKey: uniqueValueOfCategoryKey,
      name: nameFormatter(uniqueValueOfCategoryKey),
      key: uniqueValueOfCategoryKey,
      isAnimationActive: false,
      showDataAnnotations,
      data,
      axisDataKey: uniqueValueOfCategoryKey,
      dataChangeType: dataAnnotationsChangeType,
      valueFormatter: yAxisTickFormatter,
      getCurrentValue: (dataIndex, dataKey) => data[dataIndex][dataKey] ?? 0,
      getTotalValue: (dataIndex) =>
        uniqueValuesOfCategoryKey.reduce((total, categoryKeyValue) => {
          const value = data[dataIndex][categoryKeyValue] ?? 0;
          return value + total;
        }, 0),
    })
  );
}

function NonPivotedAreaPlot({ plotConfig }) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const dataAnnotationsChangeType = getAreaPlotDataAnnotationsChangeType(plotConfig);
  const data = getData(plotConfig);
  const seriesHiddenColumns = getSeriesHiddenColumns(plotConfig);

  return categoryValueAxes
    .filter((axis) => {
      return !seriesHiddenColumns.includes(axis.dataKey);
    })
    .map((axis, index) =>
      Area({
        type: 'monotone',
        stackId: '1',
        dot: true,
        dataKey: axis.dataKey,
        name: axis.name,
        key: axis.name,
        fill: getSecondaryPaletteColorByIndex(plotConfig, index),
        stroke: getPaletteColorByIndex(plotConfig, index),
        isAnimationActive: false,
        data,
        showDataAnnotations,
        axisDataKey: axis.dataKey,
        getCurrentValue: (dataIndex, dataKey) => data[dataIndex][dataKey] ?? 0,
        getTotalValue: (dataIndex) =>
          categoryValueAxes.reduce((total, categoryValueAxis) => {
            const value = data[dataIndex][categoryValueAxis.dataKey] ?? 0;
            return value + total;
          }, 0),
        dataChangeType: dataAnnotationsChangeType,
        valueFormatter: getTickFormatterFromDataKey(plotConfig, axis.dataKey),
      })
    );
}
function AreaPlot({
  plotConfig = {},
  TooltipContent = () => {},
  onBrushUpdate = () => {},
  isFollowUpDisabled = false,
}) {
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const xAxisFormat = getAxisFormat(plotConfig, xAxisDataKey);

  const [tooltip, tooltipHandlers] = useTooltip({ isFollowUpDisabled });
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
    brushSelectionType: BRUSH_SELECTION_TYPES.RANGE_AND_ITEMS,
  });

  const plotDataChangeType = getAreaPlotDataChangeType(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const yAxisConfig = getYAxis(plotConfig);
  const percentageFormatter = getFormatter('percent_1');

  const customValueFormatter = (value, dataKey, payload) => {
    const formatter = isDataPivoted
      ? getYAxisTickFormatter(plotConfig)
      : getCategoryValueAxisByDataKey(plotConfig, dataKey).tickFormatter;

    const totalValue = payload.reduce((total, payloadEntry) => payloadEntry.value + total, 0);
    const percentTotal = getRatioSafe(value, totalValue);
    const percentTotalFormatted = percentageFormatter(percentTotal);
    return `${formatter(value)} (${percentTotalFormatted})`;
  };

  const stackOffset = DATA_CHANGE_TYPE_TO_STACK_OFFSET_MAPPING[plotDataChangeType];

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  return (
    <PlotContainer ref={ref}>
      <AreaChart
        margin={margin}
        data={data}
        stackOffset={stackOffset}
        reverseStackOrder
        {...brushEvents}>
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
            // DataKey should not be included in Y-Axis when multiple metrics are shown on the y-axis.
            // Including it will break the y-axis domain.
            dataKey: isDataPivoted ? undefined : yAxisConfig.dataKey,
            tickFormatter:
              plotDataChangeType === DATA_CHANGE_TYPES.PERCENT
                ? percentageFormatter
                : yAxisConfig.tickFormatter,
          }),
          customValueFormatter,
        })}
        {isDataPivoted ? PivotedAreaPlot({ plotConfig }) : NonPivotedAreaPlot({ plotConfig })}
      </AreaChart>
    </PlotContainer>
  );
}

AreaPlot.propTypes = {};

export default AreaPlot;
