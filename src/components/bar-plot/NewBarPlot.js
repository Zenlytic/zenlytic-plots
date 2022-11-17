/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { BarChart, Cell, ReferenceLine } from 'recharts';
import { getThemeColorAsHex } from '../../constants/colors';
import { BAR_STROKE_WIDTH } from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import getItemOpacity from '../../utils/getItemOpacity';
import {
  getData,
  getMargin,
  getReferenceLineValue,
  getSeriesFillColor,
  getSeriesStrokeColor,
  getYAxisDataKey,
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

function NewBarPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const yAxisName = getYAxisName(plotConfig);
  const referenceLineValue = getReferenceLineValue(plotConfig);

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

  console.log({ hoveredItemId, clickedItemId });

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
        {referenceLineValue && <ReferenceLine y={referenceLineValue} stroke={DEFAULT_AXIS_COLOR} />}
        {Bar({
          dataKey: yAxisDataKey,
          name: yAxisName,
          fill: seriesFillColor,
          stroke: seriesStrokeColor,
          strokeWidth: BAR_STROKE_WIDTH,
          onMouseMove: (bar) => updateHoveredItemId(bar?.id),
          onMouseLeave: () => updateHoveredItemId(null),
          children: data.map((item, index) => {
            const itemOpacity = getItemOpacity({ id: item.id, hoveredItemId, clickedItemId });
            return (
              <Cell
                key={item.id}
                fill={PLOT_SECONDARY_COLORS[index % PLOT_SECONDARY_COLORS.length]}
                stroke={PLOT_COLORS[index % PLOT_COLORS.length]}
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
