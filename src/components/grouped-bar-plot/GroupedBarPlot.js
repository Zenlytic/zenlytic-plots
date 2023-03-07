/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import {
  BAR_STROKE_WIDTH,
  groupedBarDisplayTypes,
  PLOT_COLORS,
  PLOT_SECONDARY_COLORS,
} from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import Bar from '../shared/bar/Bar';

import {
  getCategoryValueAxes,
  getData,
  getGroupedBarPlotDisplayType,
  getIsDataPivoted,
  getMargin,
  getUniqueValuesOfDataKey,
  getXAxis,
  getXAxisDataKey,
  getYAxis,
  getYAxisDataKey,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

const getFormattedData = ({ data, xAxisDataKey, yAxisDataKey }) =>
  data.map((datum) => {
    const builtData = datum.data.reduce((agg, cur) => {
      const xAxisValue = cur[xAxisDataKey];
      const yAxisValue = cur[yAxisDataKey];
      agg[xAxisValue] = yAxisValue;
      return agg;
    }, {});
    return {
      name: datum.name,
      ...builtData,
    };
  });

function PivotedGroupedBarNew({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
  hoveredItemId = null,
}) {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const isSeriesStacked = displayType === groupedBarDisplayTypes.STACKED;
  const xAxisUniqueValues = getUniqueValuesOfDataKey(plotConfig, xAxisDataKey);

  return xAxisUniqueValues.map((value, index) =>
    Bar({
      id: value,
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      fill: PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length],
      dataKey: value,
      stackId: isSeriesStacked ? 'a' : undefined,
      name: value,
      key: value,
      fillOpacity: 1,
      strokeOpacity: 1,
      strokeWidth: BAR_STROKE_WIDTH,
      radius: 2,
    })
  );
}

function PivotedGroupedBar({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
  hoveredItemId = null,
}) {
  const data = getData(plotConfig);
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const isSeriesStacked = displayType === groupedBarDisplayTypes.STACKED;
  return data.map((series, index) => {
    return Bar({
      id: series.name,
      data: series.data,
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      fill: PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length],
      dataKey: yAxisDataKey,
      stackId: isSeriesStacked ? 'a' : undefined,
      name: series.name,
      key: series.name,
      fillOpacity: !hoveredItemId || hoveredItemId === series.name ? 1 : 0.2,
      strokeOpacity: !hoveredItemId || hoveredItemId === series.name ? 1 : 0.2,
      strokeWidth: BAR_STROKE_WIDTH,
      radius: 2,
      onMouseOver: () => updateHoveredItemId(series.name),
      onMouseLeave: () => updateHoveredItemId(null),
      onClick: (e) => updateClickedItemId(series.name, e?.tooltipPosition),
    });
  });
}

function NonPivotedGroupedBar({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
}) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const isSeriesStacked = displayType === groupedBarDisplayTypes.STACKED;
  return categoryValueAxes.map((axes, index) => {
    return Bar({
      dataKey: axes.dataKey,
      name: axes.name,
      fill: PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length],
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      stackId: isSeriesStacked ? 'a' : undefined,
      strokeWidth: BAR_STROKE_WIDTH,
      radius: 2,
      onMouseLeave: () => updateHoveredItemId(null),
    });
  });
}

function GroupedBar({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const data = isDataPivoted
    ? getFormattedData({ data: getData(plotConfig), xAxisDataKey, yAxisDataKey })
    : getData(plotConfig);
  // const data = getData(plotConfig);

  const margin = getMargin(plotConfig);
  const [tooltip, tooltipHandlers] = useTooltip();
  const { updateHoveredItemId = () => {}, updateClickedItemId = () => {} } = tooltipHandlers || {};
  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};
  const xAxisConfig = { ...getXAxis(plotConfig), dataKey: 'name' };
  const yAxisConfig = {};

  return (
    <PlotContainer>
      <BarChart data={data} margin={margin}>
        {GeneralChartComponents({
          plotConfig,
          useLegend: true,
          TooltipContent,
          tooltip,
          tooltipHandlers,
          legendConfig: { useStrokeColorShape: true, iconType: 'square' },
          isFollowUpDisabled,
          xAxisConfig,
          yAxisConfig,
        })}
        {/* <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend /> */}
        {isDataPivoted &&
          PivotedGroupedBarNew({
            plotConfig,
            updateHoveredItemId,
            updateClickedItemId,
            hoveredItemId,
            clickedItemId,
          })}
        {!isDataPivoted &&
          NonPivotedGroupedBar({ plotConfig, updateHoveredItemId, updateClickedItemId })}
      </BarChart>
    </PlotContainer>
  );
}

GroupedBar.propTypes = {};

export default GroupedBar;
