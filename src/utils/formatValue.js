import moment from 'moment';
import { format as d3Format } from 'd3-format';

const dateFormat = 'MM/DD/YY';
const weekFormat = 'MM/DD/YY';
const monthFormat = 'MMMM YYYY';
const quarterFormat = '[Q]Q YYYY';
const yearFormat = 'YYYY';
const hourOfDayFormat = 'LT';
const timeOfDayFormat = 'LLL';

export const TIME_FORMATS = ['date', 'month', 'week', 'quarter', 'year', 'hour_of_day', 'time'];

export const formatUnixValue = (formatter, value) => {
  switch (formatter) {
    case 'date':
      return moment.unix(value).utc().format(dateFormat);
    case 'month':
      return moment.unix(value).utc().format(monthFormat);
    case 'week':
      return moment.unix(value).utc().format(weekFormat);
    case 'quarter':
      return moment.unix(value).utc().format(quarterFormat);
    case 'year':
      return moment.unix(value).utc().format(yearFormat);
    case 'time':
      return moment.unix(value).utc().format(timeOfDayFormat);
    case null:
      return value;
    default:
      return d3Format(formatter)(value);
  }
};

const formatValue = (formatter, value) => {
  if (value === null || value === undefined) return null;
  switch (formatter) {
    case 'date':
      return moment(value).utc().format(dateFormat);
    case 'month':
      return moment(value).utc().format(monthFormat);
    case 'week':
      return moment(value).utc().format(weekFormat);
    case 'quarter':
      return moment(value).utc().format(quarterFormat);
    case 'year':
      return moment(value).utc().format(yearFormat);
    case 'time':
      return moment(value).utc().format(timeOfDayFormat);
    case null:
      return value;
    default:
      return d3Format(formatter)(value);
  }
};

export default formatValue;
