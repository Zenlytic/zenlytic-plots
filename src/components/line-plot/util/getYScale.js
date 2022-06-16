import { scaleLinear } from '@visx/scale';
import { max, min } from 'd3-array';
import { getValue } from './accessors';

// Finds the min value across all lines.
// NOT just one line
const getMinValueOfAllLines = (values, accessor) => {
  return min(values, (d) => min(d, accessor));
};
// Finds the max value across all lines.
// NOT just one line
const getMaxValueOfAllLines = (values, accessor) => {
  return max(values, (d) => max(d, accessor));
};

const getYScale = (values, dataIndex, yMax) => {
  return scaleLinear({
    range: [yMax, 0],
    domain: [
      min([getMinValueOfAllLines(values, (d) => getValue(d, dataIndex)), 0]),
      max([getMaxValueOfAllLines(values, (d) => getValue(d, dataIndex)), 0])
    ]
  });
};

export default getYScale;
