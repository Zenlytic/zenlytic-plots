import moment from 'moment';
import { SCALE_TYPES } from '../../../constants/plotConstants';

// eslint-disable-next-line import/prefer-default-export
export const getValue = (d, dataIndex, scaleType) => {
  if (scaleType === SCALE_TYPES.UTC) {
    return moment(getValue(d, dataIndex)).utc().toDate();
  }
  return d[dataIndex];
};
