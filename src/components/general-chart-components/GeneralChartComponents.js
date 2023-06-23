/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  getCategoryAxis,
  getIsCartesianPlot,
  getIsRadialPlot,
  getMargin,
  getSecondYAxis,
  getXAxis,
  getYAxis,
  getZAxis,
} from '../../utils/plotConfigGetters';
import Brush from '../shared/brush/Brush';
import GridLines from '../shared/grid-lines/GridLines';
import Tooltip from '../shared/tooltip/Tooltip';
import XAxis from '../shared/x-axis/XAxis';
import YAxis from '../shared/y-axis/YAxis';
import ZAxis from '../shared/z-axis/ZAxis';
import ZenlyticLegend from '../zenlytic-legend/ZenlyticLegend';

function GeneralChartComponents({
  plotConfig = {},
  xAxisConfig = getXAxis(plotConfig),
  yAxisConfig = getYAxis(plotConfig),
  secondYAxisConfig = getSecondYAxis(plotConfig),
  zAxisConfig = getZAxis(plotConfig),
  categoryAxisConfig = getCategoryAxis(plotConfig),
  useLegend = false,
  useGridLines = true,
  margin = getMargin(plotConfig),
  brush = {},
  brushEvents = {},
  tooltip = {},
  TooltipContent = () => {},
  legendConfig = {},
  customLabelFormatter = null,
  customValueFormatter = null,
  customNameFormatter = null,
  tooltipHandlers = {},
  isFollowUpDisabled = false,
  isSplitAxes = false,
}) {
  const isCartesianPlot = getIsCartesianPlot(plotConfig);

  return (
    <>
      {isCartesianPlot && XAxis({ ...xAxisConfig })}
      {isCartesianPlot && YAxis({ ...yAxisConfig })}
      {isCartesianPlot && YAxis({ ...secondYAxisConfig })}
      {isCartesianPlot && ZAxis({ ...zAxisConfig })}
      {isCartesianPlot && useGridLines && GridLines({})}
      {useLegend &&
        ZenlyticLegend({
          margin,
          plotConfig,
          ...legendConfig,
        })}
      {isCartesianPlot &&
        !isFollowUpDisabled &&
        brush &&
        Brush({ ...brush, yAxisId: isSplitAxes ? 'left' : undefined })}
      {Tooltip({
        plotConfig,
        xAxisConfig,
        yAxisConfig,
        zAxisConfig,
        categoryAxisConfig,
        TooltipContent,
        tooltip,
        customLabelFormatter,
        customValueFormatter,
        customNameFormatter,
        tooltipHandlers,
        brushEvents,
        brush,
        isFollowUpDisabled,
      })}
    </>
  );
}

GeneralChartComponents.propTypes = {};

export default GeneralChartComponents;
