/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { BarChart, PieChart, ReferenceLine } from 'recharts';
import { BAR_STROKE_WIDTH } from '../../constants/plotConstants';
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
  getXAxisDataKey,
  getXAxisInterval,
  getYAxis,
  getYAxisDataKey,
  getYAxisInterval,
  getYAxisName,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Bar from '../shared/bar/Bar';
import {
  PLOT_SECONDARY_COLORS,
  PLOT_COLORS,
  DEFAULT_AXIS_COLOR,
} from '../../constants/plotConstants';
import Pie from '../shared/pie/Pie';
import Cell from '../shared/cell/Cell';
import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';

const RADIAN = Math.PI / 180;

const getLabel =
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

function PiePlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
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
      updateClickedItemId(e?.activePayload?.[0]?.payload?.[xAxisDataKey], e?.activeCoordinate);
    },
    [isFollowUpMenuOpen, updateClickedItemId]
  );

  const xAxisDataKey = getXAxisDataKey(plotConfig);

  const children = data.map((entry, index) => {
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
      stroke: 'transparent',
      strokeWidth: 5,
      fillOpacity,
      id,
    });
  });

  const customLabelFormatter = (value, payload) => {
    return payload[0]?.name;
  };

  const customNameFormatter = ({ value, payload, dataKey }) => {
    return yAxisName;
  };

  const yAxisFormatter = getYAxisTickFormatter(plotConfig);

  const totalValue = data.reduce((agg, cur) => {
    agg += cur[yAxisDataKey];
    return agg;
  }, 0);
  const getPercentageValue = (value) => {
    return value / totalValue;
  };
  const label = getLabel({ yAxisFormatter, getPercentageValue });

  return (
    <PlotContainer>
      <PieChart margin={margin} onClick={onPlotClick}>
        {GeneralChartComponents({
          plotConfig,
          TooltipContent,
          tooltipHandlers,
          tooltip,
          isFollowUpDisabled,
          useLegend: true,
          customLabelFormatter,
          customNameFormatter,
        })}
        {Pie({
          dataKey: yAxisDataKey,
          nameKey: xAxisDataKey,
          data,
          children,
          label,
        })}
      </PieChart>
    </PlotContainer>
  );
}

export default PiePlot;
