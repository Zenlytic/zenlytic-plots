import styled from 'styled-components';
import colors from '../../../../constants/colors';
import fontSizes from '../../../../constants/fontSizes';
import fontWeights from '../../../../constants/fontWeights';

export const SubStatLabel = styled.div`
  color: ${colors.gray[300]};
  font-size: ${fontSizes['2xs']};
  font-weight: ${fontWeights.normal};
  line-height: 11px;
  margin-top: 4px;
  text-align: center;
`;
