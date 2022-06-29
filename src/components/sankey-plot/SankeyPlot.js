/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { Sankey, Tooltip } from 'recharts';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';
import SankeyPlotLink from './components/sankey-plot-link/SankeyPlotLink';
import SankeyPlotNode from './components/sankey-plot-node/SankeyPlotNode';

function SankeyPlot({
  plotColor = '#8a8a8a',
  valueAxis = {},
  categoryAxis = {},
  data = [],
  margin = {
    top: 32,
    left: 32,
    bottom: 32,
    right: 32,
  },
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  width = 300,
  height = 300,
}) {
  console.log('🚀 ~ file: SankeyPlot.js ~ line 27 ~ width', width);
  const { format: valueAxisFormat } = valueAxis;

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
        node={
          <SankeyPlotNode containerWidth={width - margin.left - margin.right} colors={colors} />
        }>
        <Tooltip
          content={<TooltipHandler CustomHoverTooltip={CustomHoverTooltip} />}
          formatter={(value) => formatValue(getD3DataFormatter(valueAxisFormat, value), value)}
        />
      </Sankey>
    </div>
  );
}

SankeyPlot.propTypes = {};

export default SankeyPlot;
