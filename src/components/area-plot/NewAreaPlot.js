/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Area, AreaChart } from 'recharts';
import { PLOT_COLORS, PLOT_SECONDARY_COLORS } from '../../constants/plotConstants';
import DataAnnotation from '../shared/data-annotation/DataAnnotation';
import useBrush, { BRUSH_SELECTION_TYPES } from '../../hooks/useBrush';
import useTooltip from '../../hooks/useTooltip';
import {
  getAreaPlotDataAnnotationsChangeType,
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
  return uniqueValuesOfCategoryKey.map((uniqueValueOfCategoryKeyInData, index) => (
    <Area
      stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
      fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
      dataKey={uniqueValueOfCategoryKeyInData}
      type="monotone"
      strokeWidth={2}
      name={uniqueValueOfCategoryKeyInData}
      key={uniqueValueOfCategoryKeyInData}
      stackId="1"
      label={
        showDataAnnotations ? (
          <DataAnnotation
            dataKey={uniqueValueOfCategoryKeyInData}
            categoryKeyValues={uniqueValuesOfCategoryKey}
            data={data}
            dataChangeType={dataAnnotationsChangeType}
            valueFormatter={yAxisTickFormatter}
          />
        ) : undefined
      }
    />
  ));
}

function NonPivotedAreaPlot({ plotConfig }) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const showDataAnnotations = getSeriesShowDataAnnotations(plotConfig);
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
      label={
        showDataAnnotations ? (
          <DataAnnotation formatter={getTickFormatterFromDataKey(plotConfig, axis.dataKey)} />
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
  const yAxis = getYAxis(plotConfig);
  console.log(yAxis);

  const [tooltip, tooltipHandlers] = useTooltip();
  const [brush, brushEvents] = useBrush({
    onBrushUpdate,
    tooltipHandlers,
    tooltip,
    xAxisDataKey,
    xAxisFormat,
    brushSelectionType: BRUSH_SELECTION_TYPES.RANGE_AND_ITEMS,
  });

  const isDataPivoted = getIsDataPivoted(plotConfig);
  // TODO: NJM Talk to Joe about why specifying a `dataKey` breaks
  // area charts and gives them a domain of [-Infinity, Infinity].
  const yAxisConfig = { ...getYAxis(plotConfig), dataKey: undefined };
  return (
    <PlotContainer>
      <AreaChart margin={margin} data={data} {...brushEvents}>
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
        })}
        {isDataPivoted ? PivotedAreaPlot({ plotConfig }) : NonPivotedAreaPlot({ plotConfig })}
      </AreaChart>
    </PlotContainer>
  );
}

AreaPlot.propTypes = {};

export default AreaPlot;
