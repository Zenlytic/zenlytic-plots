import React from 'react';
import styled from 'styled-components';

import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import colors from '../../../../constants/colors';
import fontSizes from '../../../../constants/fontSizes';
import { DATA_CHANGE_DIRECTIONS } from '../../../../constants/plotConstants';
import space from '../../../../constants/space';
import { SubStatLabel } from '../sub-stat-label/SubStatLabel';
import fontWeights from '../../../../constants/fontWeights';

const getColorToUse = ({
  showDataChangeDirection,
  showHighContrastDataChangeDirectionColor,
  inverseDataChangeDirectionColors,
  direction,
}) => {
  if (!showDataChangeDirection && !showHighContrastDataChangeDirectionColor) {
    return colors.gray[700];
  }

  const color = {
    [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
    [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[700],
    [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
  }[direction];

  const inversedColor = {
    [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.green[600],
    [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[700],
    [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.red[600],
  }[direction];

  const colorToUse = inverseDataChangeDirectionColors ? inversedColor : color;

  return colorToUse;
};

function SubStat({
  direction,
  topLabel,
  bottomLabel,
  formattedValue,
  showDataChangeDirection,
  showHighContrastDataChangeDirectionColor,
  inverseDataChangeDirectionColors,
  statType,
  fontSize,
}) {
  const color = getColorToUse({
    showDataChangeDirection,
    showHighContrastDataChangeDirectionColor,
    inverseDataChangeDirectionColors,
    direction,
  });

  const icon = showDataChangeDirection
    ? {
        [DATA_CHANGE_DIRECTIONS.POSITIVE]: <FiArrowUpRight color={color} />,
        [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: null,
        [DATA_CHANGE_DIRECTIONS.NEGATIVE]: <FiArrowDownRight color={color} />,
      }[direction]
    : null;

  return (
    <SubStatContainer>
      {topLabel && <TopLabel>{topLabel}</TopLabel>}
      <IconValueContainer>
        {icon}
        <SubStatValue isBold={statType === 'primary'} fontSize={fontSize} color={color}>
          {formattedValue ?? '-'}
        </SubStatValue>
      </IconValueContainer>
      <SubStatLabel>{bottomLabel}</SubStatLabel>
    </SubStatContainer>
  );
}

const TopLabel = styled.span`
  color: ${colors.gray[700]};
  font-weight: ${fontWeights.normal};
  font-size: ${fontSizes.xs};
`;

const SubStatValue = styled.span`
  color: ${(p) => p.color};
  font-size: ${(p) => p.fontSize ?? fontSizes['2xs']};
  font-weight: ${(p) => (p.isBold ? fontWeights.bold : fontWeights.normal)};
`;

const IconValueContainer = styled.div`
  display: flex;
  column-gap: ${space[1]};
`;

const SubStatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default SubStat;
