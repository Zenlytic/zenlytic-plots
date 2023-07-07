import React from 'react';
import styled from 'styled-components';

import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import colors from '../../../../constants/colors';
import fontSizes from '../../../../constants/fontSizes';
import { DATA_CHANGE_DIRECTIONS, TEXT_SIZE_TYPES } from '../../../../constants/plotConstants';
import space from '../../../../constants/space';
import fontWeights from '../../../../constants/fontWeights';
import { getValueDataChangeDirectionColor, getIconSizeProps, getValueFontSize } from '../../utils';

function SubStat({
  dataChangeDirection,
  topLabel,
  bottomLabel,
  formattedValue,
  showDataChangeDirection,
  showHighContrastDataChangeDirectionColor,
  inverseDataChangeDirectionColors,
  statType,
  staticTextSize,
  numSecondarySubStats,
  secondarySubStatIndex,
}) {
  const color = getValueDataChangeDirectionColor({
    showDataChangeDirection,
    showHighContrastDataChangeDirectionColor,
    inverseDataChangeDirectionColors,
    dataChangeDirection,
  });

  const valueFontSize = getValueFontSize({ staticTextSize, statType });

  const iconSizeProps = getIconSizeProps({ statType, staticTextSize });

  const icon = showDataChangeDirection
    ? {
        [DATA_CHANGE_DIRECTIONS.POSITIVE]: <FiArrowUpRight color={color} {...iconSizeProps} />,
        [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: null,
        [DATA_CHANGE_DIRECTIONS.NEGATIVE]: <FiArrowDownRight color={color} {...iconSizeProps} />,
      }[dataChangeDirection]
    : null;

  return (
    <SubStatContainer
      numSecondarySubStats={numSecondarySubStats}
      secondarySubStatIndex={secondarySubStatIndex}>
      {topLabel && <TopLabel>{topLabel}</TopLabel>}
      <IconValueLabelContainer
        numSecondarySubStats={numSecondarySubStats}
        secondarySubStatIndex={secondarySubStatIndex}>
        <IconValueContainer>
          {icon}
          <SubStatValue
            statType={statType}
            staticTextSize={staticTextSize}
            fontSize={valueFontSize}
            color={color}>
            {formattedValue ?? '-'}
          </SubStatValue>
        </IconValueContainer>
        <SubStatLabel statType={statType}>{bottomLabel}</SubStatLabel>
      </IconValueLabelContainer>
    </SubStatContainer>
  );
}

const IconValueLabelContainer = styled.div`
  ${(p) => {
    if (p.numSecondarySubStats !== 3) {
      return `
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;
    }
    if (p.secondarySubStatIndex === 0) {
      return `
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    `;
    }
    if (p.secondarySubStatIndex === 1) {
      return `
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;
    }
    if (p.secondarySubStatIndex === 2) {
      return `
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    `;
    }
  }};
`;

const TopLabel = styled.span`
  color: ${colors.gray[700]};
  font-weight: ${fontWeights.normal};
  font-size: ${fontSizes.xs};
  margin-bottom: ${space[3]};
  text-align: center;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
`;

const SubStatValue = styled.span`
  color: ${(p) => p.color};
  font-size: ${(p) => p.fontSize ?? fontSizes['2xs']};
  font-weight: ${(p) => (p.statType === 'primary' ? fontWeights.bold : fontWeights.normal)};
  line-height: ${(p) => {
    if (p.statType === 'secondary') {
      return '8px';
    }

    return {
      [TEXT_SIZE_TYPES.SMALL]: '16px',
      [TEXT_SIZE_TYPES.LARGE]: '24px',
    }[p.staticTextSize];
  }};
  max-width: 100%;
  text-wrap: nowrap;
`;

const IconValueContainer = styled.div`
  display: flex;
  column-gap: ${space[1]};
  align-items: flex-end;
  justify-content: center;
  max-width: 100%;
`;

const SubStatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  ${(p) => {
    if (p.numSecondarySubStats !== 3) {
      return `align-items: center;`;
    }

    if (p.secondarySubStatIndex === 0) {
      return `
      grid-column: 1 / span 1;
      text-align: right;
      align-items: flex-end;
    `;
    }
    if (p.secondarySubStatIndex === 1) {
      return `
      grid-column: 2 / span 1;
      text-align: center;
      align-items: center;
    `;
    }
    if (p.secondarySubStatIndex === 2) {
      return `
      grid-column: 3 / span 1;
      text-align: left;
      align-items: flex-start;
    `;
    }
  }};
`;

const SubStatLabel = styled.div`
  color: ${colors.gray[300]};
  font-size: ${fontSizes['2xs']};
  font-weight: ${fontWeights.normal};
  line-height: 11px;
  margin-top: ${(p) => (p.statType === 'primary' ? space[3] : space[1.5])};
  text-align: center;
`;

export default SubStat;
