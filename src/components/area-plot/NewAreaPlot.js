/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Area, AreaChart } from 'recharts';
import { changeTypes, PLOT_COLORS, PLOT_SECONDARY_COLORS } from '../../constants/plotConstants';
import DataAnnotation from '../shared/data-annotation/DataAnnotation';
import useBrush, { BRUSH_SELECTION_TYPES } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
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
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

function PivotedAreaPlot({ plotConfig }) {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);
  const dataAnnotationsChangeType = getAreaPlotDataAnnotationsChangeType(plotConfig);
  const data = getData(plotConfig);
  const plotDataChangeType = getAreaPlotDataChangeType(plotConfig);
  return uniqueValuesOfCategoryKey.map((uniqueValueOfCategoryKeyInData, index) => (
    <Area
      stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
      fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
      dataKey={uniqueValueOfCategoryKeyInData}
      type="monotone"
      strokeWidth={2}
      name={uniqueValueOfCategoryKeyInData}
      key={uniqueValueOfCategoryKeyInData}
      //   stackId={plotDataChangeType === changeTypes.PERCENT ? '1' : undefined}
      stackId="1"
      label={
        <DataAnnotation
          dataKey={uniqueValueOfCategoryKeyInData}
          categoryKeyValues={uniqueValuesOfCategoryKey}
          data={data}
          dataChangeType={dataAnnotationsChangeType}
          valueFormatter={yAxisTickFormatter}
          getCurrentValue={(index, dataKey) => {
            const datum = data[index];
            return datum[dataKey];
          }}
          getTotalValue={(index) => {
            const datum = data[index];
            const totalValue = uniqueValuesOfCategoryKey.reduce(
              (total, categoryKeyValue) => datum[categoryKeyValue] + total,
              0
            );
            return totalValue;
          }}
          showDataAnnotations={showDataAnnotations}
        />
      }
    />
  ));
}

function NonPivotedAreaPlot({ plotConfig }) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
  const dataAnnotationsChangeType = getAreaPlotDataAnnotationsChangeType(plotConfig);
  const data = getData(plotConfig);
  const plotDataChangeType = getAreaPlotDataChangeType(plotConfig);
  return categoryValueAxes.map((axis, index) => (
    <Area
      type="monotone"
      dataKey={axis.dataKey}
      name={axis.name}
      key={axis.name}
      fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
      stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
      strokeWidth={2}
      //   stackId={plotDataChangeType === changeTypes.PERCENT ? '1' : undefined}
      stackId="1"
      label={
        <DataAnnotation
          showDataAnnotations={showDataAnnotations}
          data={data}
          dataKey={axis.dataKey}
          getCurrentValue={(index, dataKey) => {
            const datum = data[index];
            return datum[dataKey];
          }}
          getTotalValue={(index) => {
            // TODO: NJM
            const datum = data[index];
            return categoryValueAxes.reduce((total, axis) => datum[axis.dataKey] + total, 0);
          }}
          dataChangeType={dataAnnotationsChangeType}
          valueFormatter={getTickFormatterFromDataKey(plotConfig, axis.dataKey)}
        />
      }
    />
  ));
}

const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

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
  const yAxis = getYAxis(plotConfig);

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
  // TODO: NJM Talk to Joe about why specifying a `dataKey` breaks
  // area charts and gives them a domain of [-Infinity, Infinity].
  const yAxisConfig = {
    ...getYAxis(plotConfig),
    dataKey: undefined,
    ...(plotDataChangeType === changeTypes.PERCENT ? { tickFormatter: toPercent } : {}),
  };

  const customValueFormatter = (value, dataKey, payload) => {
    let formatter;
    if (isDataPivoted) {
      formatter = getYAxisTickFormatter(plotConfig);
    } else {
      formatter = getCategoryValueAxes(plotConfig).find(
        (axis) => axis.dataKey === dataKey
      ).tickFormatter;
    }
    const totalValue = payload.reduce((total, payloadEntry) => payloadEntry.value + total, 0);
    const percent = getPercent(value, totalValue);
    return `${formatter(value)} (${percent})`;
  };

  const stackOffset = {
    [changeTypes.ABSOLUTE]: 'none',
    [changeTypes.PERCENT]: 'expand',
  }[plotDataChangeType];
  return (
    <PlotContainer>
      <AreaChart margin={margin} data={data} stackOffset={stackOffset} {...brushEvents}>
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
