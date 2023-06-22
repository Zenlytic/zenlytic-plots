/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useCallback } from 'react';

import { PieChart } from 'recharts';
import useTooltip from '../../hooks/useTooltip';
import {
  getData,
  getMargin,
  getXAxisDataKey,
  getYAxisDataKey,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import Pie from '../shared/pie/Pie';
import {
  customLabelFormatter,
  getChildren,
  getCustomNameFormatter,
  getGetPercentageValue,
  getLabel,
  updateClickedItemIdToPayloadItemId,
} from '../pie-plot/utils';

function DonutPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const [tooltip, tooltipHandlers] = useTooltip();
  const { isFollowUpMenuOpen } = tooltip;

  const { updateHoveredItemId, updateClickedItemId } = tooltipHandlers || {};
  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};

  const onPlotClick = useCallback(
    updateClickedItemIdToPayloadItemId({ updateClickedItemId, xAxisDataKey }),
    [isFollowUpMenuOpen, updateClickedItemId, xAxisDataKey]
  );

  const children = getChildren({ plotConfig, clickedItemId, hoveredItemId, updateHoveredItemId });

  const customNameFormatter = getCustomNameFormatter({ plotConfig });

  const yAxisFormatter = getYAxisTickFormatter(plotConfig);

  const getPercentageValue = getGetPercentageValue({ plotConfig });

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
          innerRadius: '85%',
          outerRadius: '100%',
        })}
      </PieChart>
    </PlotContainer>
  );
}

export default DonutPlot;
