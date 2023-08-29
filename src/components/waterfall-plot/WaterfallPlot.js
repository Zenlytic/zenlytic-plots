/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { BarChart, Cell, LabelList } from 'recharts';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import { COLOR_FAIL, COLOR_SUCCESS } from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import getItemOpacity from '../../utils/getItemOpacity';
import Bar from '../shared/bar/Bar';

import colors from '../../constants/colors';
import {
  getData,
  getMargin,
  getPaletteColorByIndex,
  getSecondaryPaletteColorByIndex,
  getSeriesFillColor,
  getSeriesStrokeColor,
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

function WaterfallPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const xAxisConfig = getXAxis(plotConfig);

  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

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
  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);
  const seriesFillColor = getSeriesFillColor(plotConfig);

  const getBarFillColor = (barId, index) => {
    if (barId === 'start' || barId === 'end') return seriesFillColor;
    if (barId === 'other_factors') return colors.gray[50];
    return getSecondaryPaletteColorByIndex(plotConfig, index);
  };

  const getBarStrokeColor = (barId, index) => {
    if (barId === 'start' || barId === 'end') return seriesStrokeColor;
    if (barId === 'other_factors') return colors.gray[200];

    return getPaletteColorByIndex(plotConfig, index);
  };

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
        {Bar({
          dataKey: yAxisDataKey,
          isAnimationActive: false,
          radius: 2,
          children: (
            <>
              <LabelList
                dataKey={yAxisDataKey}
                content={(props) => renderCustomizedLabel(props, yAxisTickFormatter)}
              />
              {data.map((item, index) => {
                const itemOpacity = getItemOpacity({ id: item.id, hoveredItemId, clickedItemId });
                return (
                  <Cell
                    key={item.id}
                    fill={getBarFillColor(item?.id, index)}
                    stroke={getBarStrokeColor(item?.id, index)}
                    fillOpacity={itemOpacity}
                    strokeOpacity={itemOpacity}
                    strokeWidth={1}
                  />
                );
              })}
            </>
          ),
        })}
      </BarChart>
    </PlotContainer>
  );
}

WaterfallPlot.propTypes = {};

export default WaterfallPlot;
