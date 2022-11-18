import LinePlot from 'components/line-plot/LinePlot';
import { PLOT_TYPES } from 'constants/plotConstants';
import React from 'react';
import BarPlot from '../bar-plot/BarPlot';
import GroupedBarPlot from '../grouped-bar-plot/GroupedBarPlot';
import MultiLinePlot from '../multi-line-plot/MultiLinePlot';
import ScatterPlot from '../scatter-plot/ScatterPlot';
import getPlotType from './util/getPlotType';

function ZenlyticPlot(props) {
  const { plotConfig = {} } = props;
  const plots = {
    [PLOT_TYPES.LINE]: <LinePlot {...props} />,
    [PLOT_TYPES.MULTI_LINE]: <MultiLinePlot {...props} />,
    [PLOT_TYPES.LINE_COHORT]: <MultiLinePlot {...props} />,
    [PLOT_TYPES.SCATTER]: <ScatterPlot {...props} />,
    [PLOT_TYPES.BAR]: <BarPlot layout="vertical" {...props} />,
    [PLOT_TYPES.GROUPED_BAR]: <GroupedBarPlot layout="horizontal" {...props} />,
  };
  const plotType = getPlotType(plotConfig);

  return <div style={{ userSelect: 'none' }}>{plots[plotType]}</div>;
}

ZenlyticPlot.propTypes = {};

export default ZenlyticPlot;
