import React from 'react';
import styled from 'styled-components';

import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import colors from '../../../../constants/colors';
import fontSizes from '../../../../constants/fontSizes';
import { DATA_CHANGE_DIRECTIONS } from '../../../../constants/plotConstants';
import space from '../../../../constants/space';
import { SubStatLabel } from '../sub-stat-label/SubStatLabel';

const getColorToUse = ({
  showDataChangeDirection,
  inverseDataChangeDirectionColors,
  direction,
}) => {
  if (!showDataChangeDirection) {
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
  label,
  formattedValue,
  showDataChangeDirection,
  inverseDataChangeDirectionColors,
}) {
  const color = getColorToUse({
    showDataChangeDirection,
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
      <IconValueContainer>
        {icon}
        <SubStatValue color={color}>{formattedValue}</SubStatValue>
      </IconValueContainer>
      <SubStatLabel>{label}</SubStatLabel>
    </SubStatContainer>
  );
}

const SubStatValue = styled.span`
  color: ${(p) => p.color};
  font-size: ${fontSizes['2xs']};
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
