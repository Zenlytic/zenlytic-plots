/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { Sankey, Tooltip } from 'recharts';
import TooltipHandler from '../tooltip-handler/TooltipHandler';
import SankeyPlotLink from './components/sankey-plot-link/SankeyPlotLink';
import SankeyPlotNode from './components/sankey-plot-node/SankeyPlotNode';

function SankeyPlot({
  plotColor = '#8a8a8a',
  xAxis = {},
  yAxis = {},
  data = [],
  margin = PLOT_MARGIN,
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  width = 300,
  height = 300,
}) {
  // const dataOne = {
  //   nodes: [
  //     { name: 'L0' },
  //     { name: 'L1' },
  //     { name: 'L2' },
  //     { name: 'L3' },
  //     { name: 'L4' },
  //     { name: 'R5' },
  //     { name: 'R6' },
  //     { name: 'R7' },
  //     { name: 'R8' },
  //     { name: 'R9' },
  //     { name: 'M10' },
  //   ],
  //   links: [
  //     { source: 0, target: 5, value: 30 },
  //     { source: 1, target: 8, value: 99 },
  //     { source: 1, target: 7, value: 20 },
  //     { source: 1, target: 6, value: 15 },
  //     { source: 4, target: 5, value: 6 },
  //     { source: 2, target: 8, value: 30 },
  //     { source: 0, target: 6, value: 15 },
  //     { source: 2, target: 9, value: 11 },
  //     { source: 3, target: 9, value: 8 },
  //     { source: 3, target: 8, value: 23 },
  //     { source: 2, target: 5, value: 20 },
  //     { source: 8, target: 10, value: 99 },
  //   ],
  // };

  const colors = [
    '#0f93e5',
    '#e6ac00',
    '#d510d9',
    '#e57c04',
    '#dac611',
    '#74d912',
    '#2ac2a5',
    '#1501e5',
    '#de0c08',
  ];
  const numColors = colors.length;

  const colorGradients = data.links.map((link) => {
    return {
      source: colors[link.source % numColors],
      target: colors[link.target % numColors],
    };
  });

  return (
    <div style={{ userSelect: 'none' }}>
      <Sankey
        margin={margin}
        width={width}
        height={height}
        data={data}
        nodePadding={50}
        link={<SankeyPlotLink colorGradients={colorGradients} />}
        node={<SankeyPlotNode containerWidth={960} colors={colors} />}>
        <Tooltip content={<TooltipHandler CustomHoverTooltip={CustomHoverTooltip} />} />
      </Sankey>
    </div>
  );
}

SankeyPlot.propTypes = {};

export default SankeyPlot;
