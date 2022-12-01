/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Area, AreaChart } from 'recharts';
import {
  dataChangeTypes,
  PLOT_COLORS,
  PLOT_SECONDARY_COLORS,
  dataChangeTypeToStackOffsetMapping,
} from '../../constants/plotConstants';
import useBrush, { BRUSH_SELECTION_TYPES } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import { getPercent, toPercent } from '../../utils/formatValue';
import {
  getAreaPlotDataAnnotationsChangeType,
  getAreaPlotDataChangeType,
  getAxisFormat,
  getCategoryAxisDataKey,
  getCategoryValueAxes,
  getData,
  getIsDataPivoted,
  getMargin,
  getSeriesShowDataAnnotations,
  getTickFormatterFromDataKey,
  getUniqueValuesOfDataKey,
  getXAxisDataKey,
  getYAxis,
  getYAxisTickFormatter,
  getCategoryValueAxisByDataKey,
  getXAxis,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import StackedDataAnnotation from './components/stacked-data-annotation/StackedDataAnnotation';

function PivotedAreaPlot({ plotConfig }) {
  const data = getData(plotConfig);
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);
  const dataAnnotationsChangeType = getAreaPlotDataAnnotationsChangeType(plotConfig);
  return uniqueValuesOfCategoryKey.map((uniqueValueOfCategoryKey, index) => (
    <Area
      stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
      fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
      dataKey={uniqueValueOfCategoryKey}
      type="monotone"
      strokeWidth={2}
      name={uniqueValueOfCategoryKey}
      key={uniqueValueOfCategoryKey}
      stackId="1"
      isAnimationActive={false}
      label={
        showDataAnnotations ? (
          <StackedDataAnnotation
            dataKey={uniqueValueOfCategoryKey}
            categoryKeyValues={uniqueValuesOfCategoryKey}
            data={data}
            dataChangeType={dataAnnotationsChangeType}
            valueFormatter={yAxisTickFormatter}
            getCurrentValue={(dataIndex, dataKey) => data[dataIndex][dataKey]}
            getTotalValue={(dataIndex) =>
              uniqueValuesOfCategoryKey.reduce(
                (total, categoryKeyValue) => data[dataIndex][categoryKeyValue] + total,
                0
              )
            }
          />
        ) : undefined
      }
    />
  ));
}

function NonPivotedAreaPlot({ plotConfig }) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const dataAnnotationsChangeType = getAreaPlotDataAnnotationsChangeType(plotConfig);
  const data = getData(plotConfig);
  return categoryValueAxes.map((axis, index) => (
    <Area
      type="monotone"
      dataKey={axis.dataKey}
      name={axis.name}
      key={axis.name}
      fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
      stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
      strokeWidth={2}
      stackId="1"
      isAnimationActive={false}
      label={
        showDataAnnotations ? (
          <StackedDataAnnotation
            data={data}
            dataKey={axis.dataKey}
            getCurrentValue={(dataIndex, dataKey) => data[dataIndex][dataKey]}
            getTotalValue={(dataIndex) =>
              categoryValueAxes.reduce(
                (total, categoryValueAxis) => data[dataIndex][categoryValueAxis.dataKey] + total,
                0
              )
            }
            dataChangeType={dataAnnotationsChangeType}
            valueFormatter={getTickFormatterFromDataKey(plotConfig, axis.dataKey)}
          />
        ) : undefined
      }
    />
  ));
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

  const [tooltip, tooltipHandlers] = useTooltip();
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
  const fullYAxisConfig = getYAxis(plotConfig);
  const yAxisConfig = {
    ...fullYAxisConfig,
    // DataKey should not be included in Y-Axis when multiple metrics are shown on the y-axis.
    // Including it will break the y-axis domain.
    dataKey: isDataPivoted ? undefined : fullYAxisConfig.dataKey,
    tickFormatter:
      plotDataChangeType === dataChangeTypes.PERCENT ? toPercent : fullYAxisConfig.tickFormatter,
  };

  const customValueFormatter = (value, dataKey, payload) => {
    const formatter = isDataPivoted
      ? getYAxisTickFormatter(plotConfig)
      : getCategoryValueAxisByDataKey(plotConfig, dataKey).tickFormatter;

    const totalValue = payload.reduce((total, payloadEntry) => payloadEntry.value + total, 0);
    const percent = getPercent(value, totalValue);
    return `${formatter(value)} (${percent})`;
  };

  const stackOffset = dataChangeTypeToStackOffsetMapping[plotDataChangeType];

  return (
    <PlotContainer>
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
          yAxisConfig,
          customValueFormatter,
        })}
        {isDataPivoted ? PivotedAreaPlot({ plotConfig }) : NonPivotedAreaPlot({ plotConfig })}
      </AreaChart>
    </PlotContainer>
  );
}

AreaPlot.propTypes = {};

export default AreaPlot;
