/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
// TODO: NJM Here
import { Bar, BarChart, Cell, LabelList } from 'recharts';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import {
  COLOR_FAIL,
  COLOR_SUCCESS,
  PLOT_COLORS,
  PLOT_SECONDARY_COLORS,
} from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import getItemOpacity from '../../utils/getItemOpacity';

import {
  getData,
  getMargin,
  getXAxis,
  getYAxisDataKey,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

const renderCustomizedLabel = (props, yAxisTickFormatter) => {
  const { x, y, width, height, value, fill, label, index } = props;

  const verticalOffset = height >= 0 ? 16 : -16;

  const textColor = height >= 0 ? COLOR_SUCCESS : COLOR_FAIL;

  const { id } = props || {};
  if (id === 'start' || id === 'end') return null;

  const valueDifference = value.length === 2 ? yAxisTickFormatter(value[1] - value[0]) : null;

  return (
    <g>
      <text
        x={x + width / 2}
        y={y - verticalOffset}
        position="top"
        fill={textColor}
        textAnchor="middle"
        fontSize={fontSizes.xs}
        fontWeight={fontWeights.medium}
        dominantBaseline="middle">
        {valueDifference}
      </text>
    </g>
  );
};

function NewWaterfallPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const xAxisConfig = getXAxis(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

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
          xAxisConfig: {
            ...xAxisConfig,
            tickLine: false,
            interval: 0,
            // This is in charge of only show the start, end, and other factors bar
            tickFormatter: (value, index) => {
              return index === 0 || index === data.length - 1 || index === data.length - 2
                ? value
                : '';
            },
          },
        })}
        <Bar dataKey={yAxisDataKey} isAnimationActive={false}>
          <LabelList
            dataKey={yAxisDataKey}
            content={(props) => renderCustomizedLabel(props, yAxisTickFormatter)}
          />
          {data.map((item, index) => {
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
          })}
        </Bar>
      </BarChart>
    </PlotContainer>
  );
}

NewWaterfallPlot.propTypes = {};

export default NewWaterfallPlot;
