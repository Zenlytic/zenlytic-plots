/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import { PieChart } from 'recharts';
import useTooltip from '../../hooks/useTooltip';
import {
  getData,
  getMargin,
  getRadialPlotDisplayType,
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
import { RADIAL_PLOT_DISPLAY_TYPES } from '../../constants/plotConstants';

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

  const displayType = getRadialPlotDisplayType(plotConfig);

  const cornerRadius = {
    [RADIAL_PLOT_DISPLAY_TYPES.CONDENSED]: 0,
    [RADIAL_PLOT_DISPLAY_TYPES.EXPANDED]: 7,
  }[displayType];

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
          cornerRadius,
          ...radiiProps,
        })}
      </PieChart>
    </PlotContainer>
  );
}

export default PiePlot;
