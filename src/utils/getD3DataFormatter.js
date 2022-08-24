const getD3DataFormatter = (format, value) => {
  switch (format) {
    case 'usd':
      if (value && Math.abs(value) < 1000) {
        return '$.2f';
      }
      return '$.3~s';
    case 'usd_0':
      return '$,.0~f';
    case 'usd_1':
      return '$,.1f';
    case 'usd_2':
      return '$,.2f';
    case 'percent_0':
      return '~%';
    case 'percent_1':
      return '0.1~%';
    case 'percent_2':
      return '0.2~%';
    case 'decimal':
      return '~d';
    case 'decimal_0':
      return ',.0~f';
    case 'decimal_1':
      return ',.1f';
    case 'decimal_2':
      return ',.2f';
    case 'decimal_pct_0':
      return '~d';
    case 'decimal_pct_1':
      return '.1~f';
    case 'decimal_pct_2':
      return '.2~f';
    case 'date':
    case 'hour':
    case 'second':
    case 'minute':
      return 'date';
    case 'month':
      return 'month';
    case 'year':
      return 'year';
    case 'quarter':
      return 'quarter';
    case 'week':
      return 'week';
    case 'hour_of_day':
      return 'hour_of_day';
    case 'time':
      return 'time';
    case 'default':
      if (value && Math.abs(value) < 1) {
        return '.3~f';
      }
      return '.3~s';
    default:
      return null;
  }
};
export default getD3DataFormatter;
