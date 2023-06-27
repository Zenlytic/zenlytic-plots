import React from 'react';
import { PLOT_COLORS, RADIAL_PLOT_DISPLAY_TYPES } from '../../constants/plotConstants';
import {
  getData,
  getRadialPlotDisplayType,
  getTickFormatterFromDataKey,
  getTooltipLabelDataKey,
  getXAxisDataKey,
  getYAxisDataKey,
  getYAxisName,
} from '../../utils/plotConfigGetters';
import Cell from '../shared/cell/Cell';

import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import getItemOpacity from '../../utils/getItemOpacity';

const RADIAN = Math.PI / 180;

export const getLabel =
  ({ yAxisFormatter, getPercentageValue }) =>
  (props) => {
    const { value, cx, cy, innerRadius, outerRadius, midAngle } = props;
    const formattedValue = yAxisFormatter(value);
    const radius = (innerRadius + (outerRadius - innerRadius)) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentageValue = getPercentageValue(value);
    const formattedPercentageValue = `(${(percentageValue * 100).toFixed(1)}%)`;
    const dy = '16px';
    return (
      <text
        dominantBaseline="central"
        textAnchor={x > cx ? 'start' : 'end'}
        x={x}
        y={y}
        stroke="none">
        <tspan fill={colors.gray[500]} x={x} dy={`-${dy}`} fontSize={fontSizes.xs}>
          {formattedValue}
        </tspan>
        <tspan fill={colors.gray[300]} x={x} dy={dy} fontSize={fontSizes['2xs']}>
          {formattedPercentageValue}
        </tspan>
      </text>
    );
  };

export const getChildren = ({ plotConfig, clickedItemId, hoveredItemId, updateHoveredItemId }) => {
  const data = getData(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const isSingleCategory = Array.isArray(data) && data.length === 1;
  // Hide stroke when there is only a single datum.
  const stroke = isSingleCategory ? 'transparent' : 'white';
  const displayType = getRadialPlotDisplayType(plotConfig);

  const displayTypeProps = {
    [RADIAL_PLOT_DISPLAY_TYPES.CONDENSED]: {},
    [RADIAL_PLOT_DISPLAY_TYPES.EXPANDED]: {
      strokeWidth: 6,
    },
  }[displayType];
  return data.map((entry, index) => {
    const cellColor = PLOT_COLORS[index % PLOT_COLORS.length];
    const id = entry[xAxisDataKey];
    const onMouseOver = () => updateHoveredItemId(id);
    const onMouseLeave = () => updateHoveredItemId(null);
    const fillOpacity = getItemOpacity({ id, clickedItemId, hoveredItemId });
    return Cell({
      key: `cell-${index}`,
      onMouseOver,
      onMouseLeave,
      fill: cellColor,
      stroke,
      fillOpacity,
      id,
      ...displayTypeProps,
    });
  });
};

export const getCustomLabelFormatter =
  ({ plotConfig }) =>
  (value, payload) => {
    const tooltipLabelDataKey = getTooltipLabelDataKey(plotConfig);
    const formatter = getTickFormatterFromDataKey(plotConfig, tooltipLabelDataKey);
    const rawName = payload[0]?.name;
    const formattedName = formatter(rawName);
    return formattedName;
  };

export const getCustomNameFormatter =
  ({ plotConfig }) =>
  () => {
    const yAxisName = getYAxisName(plotConfig);
    return yAxisName;
  };

export const getGetPercentageValue =
  ({ plotConfig }) =>
  (value) => {
    const data = getData(plotConfig);
    const yAxisDataKey = getYAxisDataKey(plotConfig);
    const totalValue = data.reduce((agg, cur) => {
      agg += cur[yAxisDataKey];
      return agg;
    }, 0);
    return value / totalValue;
  };

export const updateClickedItemIdToPayloadItemId =
  ({ updateClickedItemId, xAxisDataKey }) =>
  (event) => {
    updateClickedItemId(
      event?.activePayload?.[0]?.payload?.[xAxisDataKey],
      event?.activeCoordinate
    );
  };
