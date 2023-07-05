import React from 'react';
import styled from 'styled-components';

import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import colors from '../../../../constants/colors';
import fontSizes from '../../../../constants/fontSizes';
import { DATA_CHANGE_DIRECTIONS } from '../../../../constants/plotConstants';
import space from '../../../../constants/space';
import { SubStatLabel } from '../sub-stat-label/SubStatLabel';

function SubStat({ direction, label, formattedValue, inverseDataChangeDirectionColors }) {
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

  const icon = {
    [DATA_CHANGE_DIRECTIONS.POSITIVE]: <FiArrowUpRight color={colorToUse} />,
    [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: null,
    [DATA_CHANGE_DIRECTIONS.NEGATIVE]: <FiArrowDownRight color={colorToUse} />,
  }[direction];

  return (
    <SubStatContainer>
      <IconValueContainer>
        {icon}
        <SubStatValue color={colorToUse}>{formattedValue}</SubStatValue>
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
