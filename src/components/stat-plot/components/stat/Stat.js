import React from 'react';
import styled from 'styled-components';
import space from '../../../../constants/space';
import fontWeights from '../../../../constants/fontWeights';
import fontSizes from '../../../../constants/fontSizes';
import colors from '../../../../constants/colors';
import { SubStatLabel } from '../sub-stat-label/SubStatLabel';

const Stat = ({ valueColor, valueFontSize, formattedValue, name, subName }) => {
  return (
    <>
      <Label>{name}</Label>
      <Value fontSize={valueFontSize} color={valueColor}>
        {formattedValue ?? '-'}
      </Value>
      <SubStatLabel>{subName}</SubStatLabel>
    </>
  );
};

const Label = styled.div`
  color: ${colors.gray[700]};
  font-weight: ${fontWeights.normal};
  font-size: ${fontSizes.xs};
`;

const Value = styled.div`
  font-size: ${(p) => p.fontSize};
  margin-top: ${space[2]};
  font-weight: ${fontWeights.bold};
  color: ${(p) => p.color};
`;

export default Stat;
