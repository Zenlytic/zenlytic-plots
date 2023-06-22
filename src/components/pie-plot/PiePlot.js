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
      updateClickedItemId(e?.activePayload?.[0]?.payload?.id, e?.activeCoordinate);
    },
    [isFollowUpMenuOpen, updateClickedItemId]
  );

  const { width, ref } = useResizeDetector();
  const xAxisConfig = getXAxis(plotConfig);
  const xAxisInterval = getXAxisInterval(plotConfig, width);

  const xAxisDataKey = getXAxisDataKey(plotConfig);

  // console.log({ plotConfig, data, xAxisDataKey });

  const children = data.map((_, index) => {
    const cellColor = PLOT_COLORS[index % PLOT_COLORS.length];
    return Cell({ key: `cell-${index}`, fill: cellColor, stroke: 'transparent', strokeWidth: 5 });
  });

  const customLabelFormatter = (value, payload) => {
    // console.log('PiePlotz', { value, payload });
    return payload[0]?.name;
  };

  const customNameFormatter = ({ value, payload, dataKey }) => {
    // console.log({ value, payload, dataKey });
    return yAxisName;
  };

  // const customLabelFormatter = null;

  return (
    <PlotContainer ref={ref}>
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
          isAnimationActive: false,
          data,
          children,
        })}
      </PieChart>
    </PlotContainer>
  );
}

export default PiePlot;
