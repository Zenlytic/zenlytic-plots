/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

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
import {
  getCustomLabelFormatter,
  getChildren,
  getCustomNameFormatter,
  getGetPercentageValue,
  getLabel,
} from '../pie-plot/utils';
import PlotContainer from '../plot-container/PlotContainer';
import Pie from '../shared/pie/Pie';

function DonutPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const [tooltip, tooltipHandlers] = useTooltip();

  const { updateHoveredItemId, updateClickedItemId } = tooltipHandlers || {};
  const { hoveredItemId = null, clickedItemId = null } = tooltip || {};

  const children = getChildren({ plotConfig, clickedItemId, hoveredItemId, updateHoveredItemId });

  const customNameFormatter = getCustomNameFormatter({ plotConfig });

  const yAxisFormatter = getYAxisTickFormatter(plotConfig);

  const getPercentageValue = getGetPercentageValue({ plotConfig });

  const label = getLabel({ yAxisFormatter, getPercentageValue });

  const onPieClick = (event) => {
    updateClickedItemId(event.name, event.activeCoordinate);
  };

  const customLabelFormatter = getCustomLabelFormatter({ plotConfig });

  return (
    <PlotContainer>
      <PieChart margin={margin}>
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
          innerRadius: '75%',
          outerRadius: '90%',
          onClick: onPieClick,
        })}
      </PieChart>
    </PlotContainer>
  );
}

export default DonutPlot;
