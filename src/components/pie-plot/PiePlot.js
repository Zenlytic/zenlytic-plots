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
import PlotContainer from '../plot-container/PlotContainer';
import Pie from '../shared/pie/Pie';
import {
  getCustomLabelFormatter,
  getChildren,
  getCustomNameFormatter,
  getGetPercentageValue,
  getLabel,
} from './utils';

function PiePlot({
  plotConfig = {},
  TooltipContent = false,
  isFollowUpDisabled = false,
  useDonutSlices = false,
}) {
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

  const radiiProps = useDonutSlices
    ? {
        innerRadius: '75%',
        outerRadius: '90%',
      }
    : {};

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
          onClick: onPieClick,
          ...radiiProps,
        })}
      </PieChart>
    </PlotContainer>
  );
}

export default PiePlot;
