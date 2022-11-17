/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Sankey } from 'recharts';
import { PLOT_COLORS } from '../../constants/plotConstants';

import {
  getData,
  getMargin,
  getTickFormatterFromDataKey,
  getXAxisDataKey,
  getYAxisDataKey,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';
import SankeyPlotLink from './components/sankey-plot-link/SankeyPlotLink';
import SankeyPlotNode from './components/sankey-plot-node/SankeyPlotNode';

function NewSankeyPlot({ plotConfig = {}, TooltipContent = () => {}, isFollowUpDisabled = false }) {
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);

  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  let categories = [];
  // categories = data ? [...new Set(data.map((d) => d[xAxisDataKey]))] : [];
  categories = [...new Set(data?.nodes?.map((d) => d[xAxisDataKey]))];
  const nodeColors = {};
  categories.forEach((category, index) => {
    nodeColors[category] = PLOT_COLORS[index % PLOT_COLORS.length];
  });

  const colorGradients = data.links?.map((link) => {
    return {
      source: data.nodes[link.source]?.color || nodeColors[data.nodes[link.source][xAxisDataKey]],
      target: data.nodes[link.target]?.color || nodeColors[data.nodes[link.target][xAxisDataKey]],
    };
  });

  const customValueFormatter = (value) => {
    const formatter = getTickFormatterFromDataKey(plotConfig, yAxisDataKey);
    return formatter(value);
  };

  return (
    <PlotContainer>
      <Sankey
        margin={margin}
        data={data}
        nodePadding={50}
        link={<SankeyPlotLink colorGradients={colorGradients} />}
        nameKey={xAxisDataKey}
        node={
          <SankeyPlotNode
            xAxisDataKey={xAxisDataKey}
            valueFormatter={yAxisTickFormatter}
            nodeColors={nodeColors}
          />
        }>
        {GeneralChartComponents({
          plotConfig,
          TooltipContent,
          useGridLines: false,
          customValueFormatter,
          isFollowUpDisabled,
        })}
      </Sankey>
    </PlotContainer>
  );
}

NewSankeyPlot.propTypes = {};

export default NewSankeyPlot;
