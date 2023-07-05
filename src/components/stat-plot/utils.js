import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import { DATA_CHANGE_DIRECTIONS, TEXT_SIZE_TYPES } from '../../constants/plotConstants';

export const directionToBorderColorMapping = {
  [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
  [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[60],
  [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
};

export const directionToValueColorMapping = {
  [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
  [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[700],
  [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
};

export const getBorderColor = ({ direction, showDataChangeDirectionColor }) => {
  if (!showDataChangeDirectionColor) {
    return colors.gray[60];
  }
  return directionToBorderColorMapping[direction];
};

export const getValueColor = ({ direction, showDataChangeDirectionColor }) => {
  if (!showDataChangeDirectionColor) {
    return colors.gray[700];
  }
  return directionToValueColorMapping[direction];
};

export const getValueFontSize = ({ textSize, numMetrics }) => {
  const smallTextSize = fontSizes['2xl'];
  const largeTextSize = fontSizes['4xl'];
  const dynamicTextSize = numMetrics >= 3 ? smallTextSize : largeTextSize;

  return {
    [TEXT_SIZE_TYPES.DYNAMIC]: dynamicTextSize,
    [TEXT_SIZE_TYPES.SMALL]: smallTextSize,
    [TEXT_SIZE_TYPES.LARGE]: largeTextSize,
  }[textSize];
};
