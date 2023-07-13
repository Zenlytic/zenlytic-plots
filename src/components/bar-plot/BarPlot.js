/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { BarChart, Cell, ReferenceLine } from 'recharts';
import { DEFAULT_STROKE_WIDTH } from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import getItemOpacity from '../../utils/getItemOpacity';
import {
  getData,
  getDoesSeriesHaveFillColor,
  getDoesSeriesHaveStrokeColor,
  getMargin,
  getReferenceLineValue,
  getSeriesFillColor,
  getSeriesStrokeColor,
  getXAxis,
  getXAxisInterval,
  getYAxis,
  getYAxisDataKey,
  getYAxisInterval,
  getYAxisName,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Bar from '../shared/bar/Bar';
import {
  PLOT_SECONDARY_COLORS,
  PLOT_COLORS,
  DEFAULT_AXIS_COLOR,
} from '../../constants/plotConstants';

function BarPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const yAxisName = getYAxisName(plotConfig);
  const referenceLineValue = getReferenceLineValue(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const doesSeriesHaveFillColor = getDoesSeriesHaveFillColor(plotConfig);
  const seriesFillColor = getSeriesFillColor(plotConfig);
  const doesSeriesHaveStrokeColor = getDoesSeriesHaveStrokeColor(plotConfig);
  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);

  const [tooltip, tooltipHandlers] = useTooltip();
  const { isFollowUpMenuOpen } = tooltip;

  const { updateHoveredItemId, updateClickedItemId } = tooltipHandlers || {};
  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};

  const onPlotClick = useCallback(
    (e) => {
      updateClickedItemId(e?.activePayload?.[0]?.payload?.id, e?.activeCoordinate);
    },
    [isFollowUpMenuOpen, updateClickedItemId]
  );

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  return (
    <PlotContainer ref={ref}>
      <BarChart data={data} margin={margin} onClick={onPlotClick}>
        {GeneralChartComponents({
          plotConfig,
          TooltipContent,
          tooltipHandlers,
          tooltip,
          isFollowUpDisabled,
          xAxisConfig: { ...xAxisConfig, interval: xAxisInterval },
        })}
        {referenceLineValue && <ReferenceLine y={referenceLineValue} stroke={DEFAULT_AXIS_COLOR} />}
        {Bar({
          dataKey: yAxisDataKey,
          name: yAxisName,
          fill: seriesFillColor,
          stroke: seriesStrokeColor,
          strokeWidth: DEFAULT_STROKE_WIDTH,
          radius: 2,
          children: data.map((item, index) => {
            const itemOpacity = getItemOpacity({ id: item.id, hoveredItemId, clickedItemId });
            return (
              <Cell
                key={item.id}
                fill={
                  doesSeriesHaveFillColor
                    ? seriesFillColor
                    : PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]
                }
                stroke={
                  doesSeriesHaveStrokeColor
                    ? seriesStrokeColor
                    : PLOT_COLORS[index % PLOT_COLORS.length]
                }
                fillOpacity={itemOpacity}
                strokeOpacity={itemOpacity}
                strokeWidth={DEFAULT_STROKE_WIDTH}
              />
            );
          }),
        })}
      </BarChart>
    </PlotContainer>
  );
}

BarPlot.propTypes = {};

export default BarPlot;
