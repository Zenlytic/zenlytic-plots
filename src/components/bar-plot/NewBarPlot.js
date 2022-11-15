/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { BarChart, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import useTooltip from '../../hooks/useTooltip';
import getItemOpacity from '../../utils/getItemOpacity';
import Bar from '../shared/bar/Bar';
import {
  getData,
  getMargin,
  getSeriesFillColor,
  getSeriesStrokeColor,
  getXAxisDataKey,
  getXAxisName,
  getYAxisDataKey,
  getYAxisName,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

function NewBarPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const xAxisName = getXAxisName(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const seriesFillColor = getSeriesFillColor(plotConfig);
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

  return (
    <PlotContainer>
      <BarChart data={data} margin={margin} onClick={onPlotClick}>
        {GeneralChartComponents({
          plotConfig,
          TooltipContent,
          tooltipHandlers,
          tooltip,
          isFollowUpDisabled,
        })}
        {Bar({
          dataKey: yAxisDataKey,
          name: xAxisName,
          fill: seriesFillColor,
          stroke: seriesStrokeColor,

          children: data.map((item) => {
            const itemOpacity = getItemOpacity({ id: item.id, hoveredItemId, clickedItemId });
            return (
              <Cell
                key={item.id}
                fill={seriesFillColor}
                stroke={seriesStrokeColor}
                fillOpacity={itemOpacity}
                strokeOpacity={itemOpacity}
                strokeWidth={2}
              />
            );
          }),
        })}
      </BarChart>
    </PlotContainer>
  );
}

NewBarPlot.propTypes = {};

export default NewBarPlot;
