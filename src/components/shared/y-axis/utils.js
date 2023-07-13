import { DEFAULT_Y_AXIS_RANGE } from '../../../utils/plotConfigGetters';

export const getAllowDataOverflow = ({ domain }) => {
  const isDefaultDomain =
    domain[0] === DEFAULT_Y_AXIS_RANGE.MIN_VALUE && domain[1] === DEFAULT_Y_AXIS_RANGE.MAX_VALUE;
  const userHasSetCustomDomain = !isDefaultDomain;

  // When a user has set a custom domain, we allow data to overflow.
  // Otherwise the plot adjusts the domain to ensure all data is fit in,
  // which is confusing to the user that's trying to control that domain.
  return userHasSetCustomDomain;
};
