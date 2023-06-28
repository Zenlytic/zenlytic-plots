/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import radii from '../../constants/radii';
import space from '../../constants/space';
import {
  getAxisName,
  getPrimaryNumberSubStatDataKey,
  getSeries,
  getStatDataKeys,
  getSubStatAxis,
  getSubStatDataKeys,
  getSubStatDatumByDataKey,
  getTickFormatterFromDataKey,
} from '../../utils/plotConfigGetters';

function StatPlot({ plotConfig = {} }) {
  const statDataKeys = getStatDataKeys(plotConfig);
  const numMetrics = statDataKeys.length;
  const showBorder = numMetrics !== 1;
  const subStatDataKeys = getSubStatDataKeys(plotConfig);
  const primaryNumberSubStatDataKey = getPrimaryNumberSubStatDataKey(plotConfig);

  const canShowPrimaryNumber = primaryNumberSubStatDataKey !== null;
  const subStatsToShowBelowPrimaryNumber = subStatDataKeys.filter(
    (subStatDataKey) => subStatDataKey !== primaryNumberSubStatDataKey
  );

  console.log({ primaryNumberSubStatDataKey, subStatsToShowBelowPrimaryNumber });

  return canShowPrimaryNumber ? (
    <StatsList numMetrics={numMetrics}>
      {statDataKeys.map((statDataKey) => {
        const tickFormatter = getTickFormatterFromDataKey(plotConfig, statDataKey);
        const datum = getSubStatDatumByDataKey(
          plotConfig,
          statDataKey,
          primaryNumberSubStatDataKey
        );
        const value = datum[statDataKey];
        const { formatter, label: subStatLabel } = datum || { label: '', formatter: () => null };
        const percentFormatter = (value) => {
          return `${value * 100}%`;
        };
        // TODO: NJM Rename omg
        let finalFormatter = formatter === 'Y_AXIS' ? tickFormatter : percentFormatter;
        if (typeof finalFormatter !== 'function') {
          finalFormatter = (value) => value;
        }
        const formattedValue = finalFormatter(value);
        const axisName = getAxisName(plotConfig, statDataKey);
        const showSubStats = subStatsToShowBelowPrimaryNumber.length > 0;

        console.log({ showSubStats });
        return (
          <Stat showBorder={showBorder} key={statDataKey}>
            <Label>{axisName}</Label>
            <Value>{formattedValue ?? '-'}</Value>
            <SubStatLabel>{subStatLabel}</SubStatLabel>
            {showSubStats && (
              // TODO: NJM think I need to differentiate more between subStatDataKeys
              // and subStatDataKey, like obviously pick different names
              <SubStatList>
                {subStatsToShowBelowPrimaryNumber.map((subStatDataKey) => (
                  <SubStat
                    key={subStatDataKey}
                    subStatDataKey={subStatDataKey}
                    statDataKey={statDataKey}
                    plotConfig={plotConfig}
                  />
                ))}
              </SubStatList>
            )}
          </Stat>
        );
      })}
    </StatsList>
  ) : (
    <EnableOneStatMessage>
      Please enable at least one stat and select a primary number.
    </EnableOneStatMessage>
  );
}

function SubStat({ plotConfig, statDataKey, subStatDataKey }) {
  const statAxis = getSubStatAxis(plotConfig, statDataKey);

  const subStatFormatter = statAxis.subStatFormatter;
  const subStatData = getSubStatDatumByDataKey(plotConfig, statDataKey, subStatDataKey);
  // console.log({ subStatData, subStatDataKey, statDataKey });
  const valueFormatter = getTickFormatterFromDataKey(plotConfig, statDataKey);
  const value = subStatData[statDataKey];
  const formatterProps = {
    ...subStatData,
    valueFormatter,
    value,
    subStatDataKey,
  };
  console.log({ formatterProps });
  return subStatFormatter(formatterProps);
}

const getStatGridCss = (numMetrics) => {
  if (numMetrics <= 3) {
    return `
      grid-auto-flow: column;
      grid-auto-columns: minmax(0, 1fr);
    `;
  }
  const numColumns = numMetrics === 4 ? 2 : 3;
  return `grid-template-columns: repeat(${numColumns}, 1fr);`;
};

const StatsList = styled.div`
  display: grid;
  ${(p) => getStatGridCss(p.numMetrics)}
  gap: ${space[4]};
  height: 100%;
  padding: ${space[4]};
`;

const Stat = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${(p) => (p.showBorder ? `${space.px} solid ${colors.gray[60]}` : 'none')};
  border-radius: ${radii.lg};
`;

const SubStatLabel = styled.div`
  color: ${colors.gray[300]};
  font-size: ${fontSizes['2xs']};
  font-weight: ${fontWeights.normal};
  line-height: 11px;
`;

const Label = styled.div`
  color: ${colors.gray[500]};
  font-weight: ${fontWeights.light};
  font-size: ${fontSizes.xs};
  line-height: ${space[10]};
`;

const Value = styled.div`
  font-size: ${fontSizes['4xl']};
  margin-top: ${space[1]};
  font-weight: ${fontWeights.bold};
`;

const SubStatList = styled.div`
  display: flex;
  column-gap: 16px;
`;

const EnableOneStatMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default StatPlot;
