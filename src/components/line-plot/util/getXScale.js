import { scaleLinear, scaleUtc } from '@visx/scale';
import { SCALE_TYPES } from 'constants/plotConstants';
import { max, min } from 'd3-array';
import moment from 'moment';
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

const endOfToday = moment().utc().endOf().toDate();

const getXScale = (values, dataIndex, xMax, scaleType) => {
  if (scaleType === SCALE_TYPES.UTC) {
    return scaleUtc({
      range: [0, xMax],
      domain: [
        getMinValueOfAllLines(values, (d) => getValue(d, dataIndex, scaleType)),
        min([getMaxValueOfAllLines(values, (d) => getValue(d, dataIndex, scaleType)), endOfToday])
      ]
    });
  }
  return scaleLinear({
    range: [0, xMax],
    domain: [
      min([getMinValueOfAllLines(values, (d) => getValue(d, dataIndex)), 0]),
      max([getMaxValueOfAllLines(values, (d) => getValue(d, dataIndex)), 0])
    ]
  });
};

export default getXScale;
