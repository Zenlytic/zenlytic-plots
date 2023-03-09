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
  getCategoryAxisDataKey,
  getCategoryValueAxes,
  getCategoryValueAxisByDataKey,
  getData,
  getGroupedBarPlotDisplayType,
  getIsDataPivoted,
  getMargin,
  getUniqueValuesOfDataKey,
  getXAxis,
  getXAxisDataKey,
  getYAxis,
  getYAxisDataKey,
  getYAxisTickFormatter,
  pivotDataByDataKey,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import { overrideAxisConfig } from '../../utils/overrideAxisConfig';

function PivotedGroupedBar({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
  hoveredItemId = null,
}) {
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const isSeriesStacked = displayType === groupedBarDisplayTypes.STACKED;
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);

  return uniqueValuesOfCategoryKey.map((value, index) =>
    Bar({
      id: value,
      dataKey: value,
      name: value,
      key: value,
      stackId: isSeriesStacked ? 'a' : undefined,
      fill: PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length],
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      strokeWidth: BAR_STROKE_WIDTH,
      fillOpacity: !hoveredItemId || hoveredItemId === value ? 1 : 0.2,
      strokeOpacity: !hoveredItemId || hoveredItemId === value ? 1 : 0.2,
      radius: 2,
      onMouseOver: () => updateHoveredItemId(value),
      onMouseLeave: () => updateHoveredItemId(null),
      onClick: (e) => updateClickedItemId(value, e?.tooltipPosition),
    })
  );
}

function NonPivotedGroupedBar({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
}) {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const isSeriesStacked = displayType === groupedBarDisplayTypes.STACKED;
  return categoryValueAxes?.map((axes, index) => {
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
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const [tooltip, tooltipHandlers] = useTooltip();
  const { updateHoveredItemId = () => {}, updateClickedItemId = () => {} } = tooltipHandlers || {};
  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};

  const yAxisConfig = getYAxis(plotConfig);

  const customValueFormatter = (value, dataKey) => {
    const formatter = isDataPivoted
      ? getYAxisTickFormatter(plotConfig)
      : getCategoryValueAxisByDataKey(plotConfig, dataKey).tickFormatter;
    return formatter(value);
  };

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
          yAxisConfig: overrideAxisConfig(yAxisConfig, {
            dataKey: isDataPivoted ? undefined : yAxisConfig.dataKey,
          }),
          customValueFormatter,
        })}
        {isDataPivoted &&
          PivotedGroupedBar({
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
