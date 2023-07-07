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

export const getBorderColor = ({ direction, showHighContrastDataChangeDirectionColor }) => {
  if (!showHighContrastDataChangeDirectionColor) {
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

export const getStaticTextSize = ({ textSize, numMetrics }) => {
  if (textSize === TEXT_SIZE_TYPES.DYNAMIC) {
    return numMetrics >= 3 ? TEXT_SIZE_TYPES.SMALL : TEXT_SIZE_TYPES.LARGE;
  }

  return textSize;
};

export const getIconSizeProps = ({ statType, staticTextSize }) => {
  // The viewBox is edited so that the icon takes up the entire space within the SVG.
  // These were fine-tuned with the line-height of the formattedValue to ensure the
  // arrow takes up the exact same vertical space as the formattedValue.
  const secondarySubStatIconSizeProps = { size: '8px', viewBox: '6 6 12 12' };
  const primarySubStatLargeTextSizeIconSizeProps = { size: '24px', viewBox: '6 6 12 12' };
  const primarySubStatSmallTextSizeIconSizeProps = { size: '16px', viewBox: '6 6 12 12' };

  if (statType === 'secondary') {
    return secondarySubStatIconSizeProps;
  }

  if (staticTextSize === TEXT_SIZE_TYPES.LARGE) {
    return primarySubStatLargeTextSizeIconSizeProps;
  }

  return primarySubStatSmallTextSizeIconSizeProps;
};

export const getDataChangeDirectionFromValue = (value) => {
  if (value === 0) {
    return DATA_CHANGE_DIRECTIONS.NO_CHANGE;
  }

  if (value < 0) {
    return DATA_CHANGE_DIRECTIONS.NEGATIVE;
  }

  return DATA_CHANGE_DIRECTIONS.POSITIVE;
};
