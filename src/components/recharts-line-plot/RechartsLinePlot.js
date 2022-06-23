/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
  Label,
  AreaChart,
  Area,
  ReferenceArea,
} from 'recharts';
import moment from 'moment';
import formatValue from '../../utils/formatValue';
import { PLOT_MARGIN } from '../../constants/plotConstants';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

function RechartsLinePlot({
  lines,
  xAxisDataIndex,
  yAxisDataIndex,
  xAxisZenlyticFormat,
  yAxisZenlyticFormat,
  xAxisLabel,
  yAxisLabel,
  plotColor,
  width = 300,
  height = 300,
  tickCount = 5,
  minTickGap = 100,
  interval = 'preserveEnd',
}) {
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const onBrushEnd = () => {
    setIsDragging(false);
    setIsClickTooltipVisible(true);

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      setIsClickTooltipVisible(false);
      setClickTooltipCoords(null);
    }
    if (refAreaLeft > refAreaRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(refAreaLeft);
    }
  };

  //   const CustomTooltip = ({ active, payload, label, ...restProps }) => {
  //     if (isClickTooltipVisible) {
  //       return (
  //         <div style={{ background: 'white', borderRadius: '10px' }}>
  //           <p className="desc">Anything you want can be displayed here.</p>
  //         </div>
  //       );
  //     }
  //     return false;
  //   };

  //   const CustomHoverTooltip = ({ active, payload, label, ...restProps }) => {
  //     if (!isClickTooltipVisible) {
  //       return (
  //         <div style={{ background: 'white', borderRadius: '10px' }}>
  //           <p className="desc">Things left to say</p>
  //         </div>
  //       );
  //     }
  //     return false;
  //   };

  const data = lines[0];
  return (
    // <ResponsiveContainer width={300} height={100}>
    <div style={{ userSelect: 'none' }}>
      <AreaChart
        height={height}
        width={width}
        data={data}
        // margin={PLOT_MARGIN}
        onMouseDown={(e) => {
          setIsDragging(true);
          setRefAreaLeft(e.activeLabel);
        }}
        onMouseMove={(e) => {
          if (refAreaLeft && isDragging) {
            setRefAreaRight(e.activeLabel);
            setClickTooltipCoords(e.activeCoordinate);
          }
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseUp={onBrushEnd}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          height={70}
          domain={['dataMin', 'dataMax']}
          // tickCount={tickCount}
          minTickGap={minTickGap}
          dataKey={xAxisDataIndex}
          interval={interval}
          tickFormatter={(timeStr) => formatValue(xAxisZenlyticFormat, timeStr)}>
          <Label value={xAxisLabel} offset={0} position="centerBottom" />
        </XAxis>
        <YAxis tickFormatter={(timeStr) => formatValue(yAxisZenlyticFormat, timeStr)}>
          <Label value={yAxisLabel} offset={0} position="insideLeft" angle={-90} />
        </YAxis>
        {/* <Tooltip content={<CustomHoverTooltip />} />
            <Tooltip position={clickTooltipCoords} content={<CustomTooltip />} /> */}
        {/* <Brush dataKey={xAxisZenlyticFormat} height={30} stroke={plotColor} /> */}
        <Legend />
        <Area
          type="monotone"
          dataKey={yAxisDataIndex}
          stroke={plotColor}
          strokeWidth={2}
          activeDot={{ r: 8 }}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <ReferenceArea
          x1={refAreaRight}
          x2={refAreaLeft}
          strokeOpacity={0.3}
          isFront
          stroke="gray"
          alwaysShow
        />
      </AreaChart>
    </div>
    // </ResponsiveContainer>
  );
}

RechartsLinePlot.propTypes = {};

export default RechartsLinePlot;
