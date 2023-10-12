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

// TODO: ZEN-1114 datetime logic should be centralized.
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
      return d3Format(formatter)(value).replace('G', 'B');
  }
};

// TODO: ZEN-1114 datetime logic should be centralized.
const formatValue = (formatter, value) => {
  if (value === null || value === undefined) return null;
  switch (formatter) {
    case 'date':
      return moment.utc(value).format(dateFormat);
    case 'month':
      return moment.utc(value).format(monthFormat);
    case 'week':
      return moment.utc(value).format(weekFormat);
    case 'quarter':
      return moment.utc(value).format(quarterFormat);
    case 'year':
      return moment.utc(value).format(yearFormat);
    case 'time':
      return moment.utc(value).format(timeOfDayFormat);
    case null:
      return value;
    default:
      // d3-format has a local config, but seems out of scope for now
      if (formatter.includes('€')) {
        return `€${d3Format(formatter.replace('€', ''))(value)}`;
      }
      return d3Format(formatter)(value).replace('G', 'B');
  }
};

export default formatValue;
