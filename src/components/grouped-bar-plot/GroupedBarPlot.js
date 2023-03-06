/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BarChart } from 'recharts';
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
  getYAxisDataKey,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

function PivotedGroupedBar({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
  hoveredItemId = null,
}) {
  const data = getData(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const isSeriesStacked = displayType === groupedBarDisplayTypes.STACKED;
  return data.map((series, index) => {
    return Bar({
      id: series.name,
      data: series.data,
      stroke: PLOT_COLORS[index % PLOT_COLORS.length],
      fill: PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length],
      dataKey: yAxisDataKey,
      name: series.name,
      key: series.name,
      stackId: isSeriesStacked ? 'a' : undefined,
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
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const [tooltip, tooltipHandlers] = useTooltip();
  const { updateHoveredItemId = () => {}, updateClickedItemId = () => {} } = tooltipHandlers || {};

  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};
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
