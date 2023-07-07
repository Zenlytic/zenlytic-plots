import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import { DATA_CHANGE_DIRECTIONS, TEXT_SIZE_TYPES } from '../../constants/plotConstants';

const dataChangeDirectionToBorderColorMapping = {
  [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
  [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[60],
  [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
};

const getInversedDataChangeDirection = (dataChangeDirection) => {
  return {
    [DATA_CHANGE_DIRECTIONS.POSITIVE]: DATA_CHANGE_DIRECTIONS.NEGATIVE,
    [DATA_CHANGE_DIRECTIONS.NEGATIVE]: DATA_CHANGE_DIRECTIONS.POSITIVE,
    [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: DATA_CHANGE_DIRECTIONS.NO_CHANGE,
  }[dataChangeDirection];
};

export const getBorderDataChangeDirectionColor = ({
  dataChangeDirection,
  showHighContrastDataChangeDirectionColor,
  inverseDataChangeDirectionColors,
}) => {
  if (!showHighContrastDataChangeDirectionColor) {
    return colors.gray[60];
  }

  const color = dataChangeDirectionToBorderColorMapping[dataChangeDirection];

  const inversedDataChangeDirection = getInversedDataChangeDirection(dataChangeDirection);

  const inversedColor = dataChangeDirectionToBorderColorMapping[inversedDataChangeDirection];

  return inverseDataChangeDirectionColors ? inversedColor : color;
};

export const getValueFontSize = ({ staticTextSize, statType }) => {
  if (statType === 'secondary') {
    return fontSizes['2xs'];
  }

  const smallTextSize = fontSizes['2xl'];
  const largeTextSize = fontSizes['4xl'];

  return {
    [TEXT_SIZE_TYPES.SMALL]: smallTextSize,
    [TEXT_SIZE_TYPES.LARGE]: largeTextSize,
  }[staticTextSize];
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

const dataChangeDirectionToColorMapping = {
  [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
  [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[700],
  [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
};

export const getValueDataChangeDirectionColor = ({
  showDataChangeDirection,
  showHighContrastDataChangeDirectionColor,
  inverseDataChangeDirectionColors,
  dataChangeDirection,
}) => {
  if (!showDataChangeDirection && !showHighContrastDataChangeDirectionColor) {
    return colors.gray[700];
  }

  const color = dataChangeDirectionToColorMapping[dataChangeDirection];

  const inversedDataChangeDirection = getInversedDataChangeDirection(dataChangeDirection);

  const inversedColor = dataChangeDirectionToBorderColorMapping[inversedDataChangeDirection];

  const colorToUse = inverseDataChangeDirectionColors ? inversedColor : color;

  return colorToUse;
};
