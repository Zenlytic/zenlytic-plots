/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

function WaterfallPlot(props) {
  const data = [
    {
      name: '01/2020',
      uv: 2400, // uv is the part of the graph we want to show
      pv: 0, // pv is the floating part (transparent)
    },
    {
      name: '02/2020',
      uv: -400,
      pv: 2400, // to get this pv, we use 01/2020's uv + pv
    },
    {
      name: '03/2020',
      uv: -400,
      pv: 2000, // use 02/2020's uv + pv, and so forth
    },
    {
      name: '04/2020',
      uv: 800,
      pv: 1600,
    },
    {
      name: '05/2020',
      uv: 900,
      pv: 2400,
    },
    {
      name: '06/2020',
      uv: -500,
      pv: 3300,
    },
    {
      name: '07/2020',
      uv: 900,
      pv: 2800,
    },
    {
      name: 'Total',
      uv: 3700,
      pv: 0,
    },
  ];

  const getPath = (x, y, width, height) =>
    `M${x},${y + height}
     C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
     C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${
      y + height
    }
     Z`;

  const TriangleBar = (props) => {
    console.log('🚀 ~ file: WaterfallPlot.js ~ line 59 ~ TriangleBar ~ props', props);
    const { fill, x, y, width, height, uv, t, name } = props;

    let totalHeight = y + height;
    let targetY = totalHeight - (height / uv) * t;

    if (name === 'Total') {
      return false;
    }

    return (
      <svg>
        {/* <rect x={x} y={y} width={width} height={height} stroke="none" fill={fill} /> */}
        <line
          x1={x + width}
          x2={x + width + 20}
          y1={y + height}
          y2={y + height}
          stroke={'#2967c1'}
          strokeWidth={2}
          strokeDasharray={'2'}
        />
      </svg>
    );
    // const { fill, x, y, width, height } = props;

    // return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  return (
    <BarChart width={650} height={300} data={data} barCategoryGap={10}>
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="name" />
      <YAxis type="number" />
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      <Bar dataKey="pv" stackId="a" fill="transparent" />
      <Bar dataKey="uv" stackId="a" fill="#82ca9d">
        {data.map((item, index) => {
          if (item.uv < 0) {
            return <Cell key={index} fill="#B22222" />;
          }
          if (item.name === 'Total') {
            return <Cell key={index} fill="#0000CD" />;
          }
          return <Cell key={index} fill="#228B22" />;
        })}
      </Bar>
      <Bar stackId="a" fill="#82ca9d" shape={<TriangleBar />} />
    </BarChart>
  );
}

WaterfallPlot.propTypes = {};

export default WaterfallPlot;
