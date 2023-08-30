/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { BarChart, Cell, ReferenceLine } from 'recharts';
import { DEFAULT_AXIS_PROPS, DEFAULT_STROKE_WIDTH } from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import getItemOpacity from '../../utils/getItemOpacity';
import {
  getData,
  getDoesSeriesHaveFillColor,
  getDoesSeriesHaveStrokeColor,
  getMargin,
  getPaletteColorByIndex,
  getReferenceLineValue,
  getSecondaryPaletteColorByIndex,
  getSeriesFillColor,
  getSeriesStrokeColor,
  getXAxis,
  getXAxisInterval,
  getYAxisDataKey,
  getYAxisName,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Bar from '../shared/bar/Bar';

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

  const [tooltip, tooltipHandlers] = useTooltip({ isFollowUpDisabled });
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
        {referenceLineValue && (
          <ReferenceLine y={referenceLineValue} stroke={DEFAULT_AXIS_PROPS.stroke} />
        )}
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
                    : getSecondaryPaletteColorByIndex(plotConfig, index)
                }
                stroke={
                  doesSeriesHaveStrokeColor
                    ? seriesStrokeColor
                    : getPaletteColorByIndex(plotConfig, index)
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
