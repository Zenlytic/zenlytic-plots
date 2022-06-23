import React from 'react';
import PropTypes from 'prop-types';
import { Sankey, Tooltip } from 'recharts';
import SankeyPlotNode from './components/sankey-plot-node/SankeyPlotNode';
import SankeyPlotLink from './components/sankey-plot-link/SankeyPlotLink';

function SankeyPlot(props) {
  const data = {
    nodes: [
      { name: 'L0' },
      { name: 'L1' },
      { name: 'L2' },
      { name: 'L3' },
      { name: 'L4' },
      { name: 'R5' },
      { name: 'R6' },
      { name: 'R7' },
      { name: 'R8' },
      { name: 'R9' },
      { name: 'M10' },
    ],
    links: [
      { source: 0, target: 5, value: 30 },
      { source: 1, target: 8, value: 99 },
      { source: 1, target: 7, value: 20 },
      { source: 1, target: 6, value: 15 },
      { source: 4, target: 5, value: 6 },
      { source: 2, target: 8, value: 30 },
      { source: 0, target: 6, value: 15 },
      { source: 2, target: 9, value: 11 },
      { source: 3, target: 9, value: 8 },
      { source: 3, target: 8, value: 23 },
      { source: 2, target: 5, value: 20 },
      { source: 8, target: 10, value: 99 },
    ],
  };

  const colors = ['#F9DB6D', '#40F99B', '#AFC2D5', '#FF8360', '#EC9192'];
  const numColors = colors.length;

  const colorGradients = data.links.map((link) => {
    return {
      source: colors[link.source % numColors],
      target: colors[link.target % numColors],
    };
  });

  return (
    <Sankey
      width={960}
      height={500}
      data={data}
      // node={<MyCustomNode />}
      nodePadding={50}
      link={<SankeyPlotLink colorGradients={colorGradients} />}
      node={<SankeyPlotNode containerWidth={960} colors={colors} />}>
      <Tooltip />
    </Sankey>
  );
}

SankeyPlot.propTypes = {};

export default SankeyPlot;
