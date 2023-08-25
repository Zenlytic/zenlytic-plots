/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { BarChart } from 'recharts';

import { DEFAULT_STROKE_WIDTH, GROUPED_BAR_DISPLAY_TYPES } from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import Bar from '../shared/bar/Bar';

import { overrideAxisConfig } from '../../utils/overrideAxisConfig';
import {
  getCategoryAxisDataKey,
  getCategoryAxisFormatter,
  getCategoryValueAxes,
  getCategoryValueAxisByDataKey,
  getData,
  getGroupedBarPlotDisplayType,
  getIsDataPivoted,
  getMargin,
  getPaletteColorByIndex,
  getSecondaryPaletteColorByIndex,
  getUniqueValuesOfDataKey,
  getXAxis,
  getXAxisInterval,
  getYAxis,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

function PivotedGroupedBar({
  plotConfig = {},
  updateHoveredItemId = () => {},
  updateClickedItemId = () => {},
  hoveredItemId = null,
}) {
  const displayType = getGroupedBarPlotDisplayType(plotConfig);
  const isSeriesStacked = displayType === GROUPED_BAR_DISPLAY_TYPES.STACKED;
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfCategoryKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  const nameFormatter = getCategoryAxisFormatter(plotConfig);

  return uniqueValuesOfCategoryKey.map((value, index) =>
    Bar({
      id: value,
      dataKey: value,
      name: nameFormatter(value),
      key: value,
      stackId: isSeriesStacked ? 'a' : undefined,
      fill: getSecondaryPaletteColorByIndex(plotConfig, index, value),
      stroke: getPaletteColorByIndex(plotConfig, index, value),
      strokeWidth: DEFAULT_STROKE_WIDTH,

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
  const isSeriesStacked = displayType === GROUPED_BAR_DISPLAY_TYPES.STACKED;
  return categoryValueAxes?.map((axes, index) => {
    return Bar({
      dataKey: axes.dataKey,
      name: axes.name,
      fill: getSecondaryPaletteColorByIndex(plotConfig, index, axes.dataKey),
      stroke: getPaletteColorByIndex(plotConfig, index, axes.dataKey),
      stackId: isSeriesStacked ? 'a' : undefined,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      radius: 2,
      onMouseLeave: () => updateHoveredItemId(null),
    });
  });
}

function GroupedBar({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const [tooltip, tooltipHandlers] = useTooltip({ isFollowUpDisabled });
  const { updateHoveredItemId = () => {}, updateClickedItemId = () => {} } = tooltipHandlers || {};
  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};

  const yAxisConfig = getYAxis(plotConfig);

  const customValueFormatter = (value, dataKey) => {
    const formatter = isDataPivoted
      ? getYAxisTickFormatter(plotConfig)
      : getCategoryValueAxisByDataKey(plotConfig, dataKey).tickFormatter;
    return formatter(value);
  };

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  return (
    <PlotContainer ref={ref}>
      <BarChart data={data} margin={margin}>
        {GeneralChartComponents({
          plotConfig,
          useLegend: true,
          TooltipContent,
          tooltip,
          tooltipHandlers,
          legendConfig: { useStrokeColorShape: true, iconType: 'square' },
          isFollowUpDisabled,
          xAxisConfig: { ...xAxisConfig, interval: xAxisInterval },
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
