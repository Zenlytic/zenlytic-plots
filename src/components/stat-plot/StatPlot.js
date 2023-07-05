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
  getAxisFromDataKey,
  getData,
  getFormatter,
  getPrimaryNumberSubStatDataKey,
  getSeries,
  getStatPlotShowDataChangeDirectionColor,
  getStatPlotTextSize,
} from '../../utils/plotConfigGetters';
import SubStat from './components/sub-stat/SubStat';
import {
  getBorderColor,
  getDataChangeDirectionFromValue,
  getValueColor,
  getValueFontSize,
} from './utils';
import { SubStatLabel } from './components/sub-stat-label/SubStatLabel';

function StatPlot({ plotConfig = {} }) {
  const series = getSeries(plotConfig);
  const { primarySubMetricDataKeys, secondarySubMetricDataKeys } = series;
  const data = getData(plotConfig);
  const numMetrics = data.length;
  const showBorder = numMetrics !== 1;

  const primaryNumberSubStatDataKey = getPrimaryNumberSubStatDataKey(plotConfig);
  const showDataChangeDirectionColor = getStatPlotShowDataChangeDirectionColor(plotConfig);
  const textSize = getStatPlotTextSize(plotConfig);

  const canShowPrimaryNumber = primaryNumberSubStatDataKey !== null;

  return canShowPrimaryNumber ? (
    <StatsList numMetrics={numMetrics}>
      {data.map((datum) => {
        const valueFontSize = getValueFontSize({ textSize, numMetrics });

        const datumEntries = Object.keys(datum);

        const primarySubMetricDataKeyForDatum = datumEntries.find((datumEntry) =>
          primarySubMetricDataKeys.includes(datumEntry)
        );

        const secondarySubMetricDataKeysForDatum = datumEntries.filter((datumEntry) =>
          secondarySubMetricDataKeys.includes(datumEntry)
        );

        const showSubStats = secondarySubMetricDataKeysForDatum.length > 0;
        const primaryNumberValue = datum[primarySubMetricDataKeyForDatum];
        const dataChangeDirection = getDataChangeDirectionFromValue(primaryNumberValue);

        const valueColor = getValueColor({
          showDataChangeDirectionColor,
          direction: dataChangeDirection,
        });
        const borderColor = getBorderColor({
          direction: dataChangeDirection,
          showDataChangeDirectionColor,
        });

        const axis = getAxisFromDataKey(plotConfig, primarySubMetricDataKeyForDatum);

        if (axis === undefined) {
          return null;
        }
        const { format, name, subName } = axis;
        const formatValue = getFormatter(format);
        const formattedValue = formatValue(primaryNumberValue);

        return (
          <Stat
            showBorder={showBorder}
            borderColor={borderColor}
            key={primarySubMetricDataKeyForDatum}>
            <Label>{name}</Label>
            <Value fontSize={valueFontSize} color={valueColor}>
              {formattedValue ?? '-'}
            </Value>
            <SubStatLabel>{subName}</SubStatLabel>
            {showSubStats && (
              <SubStatList>
                {secondarySubMetricDataKeysForDatum.map((subStatDataKey) => {
                  const axis = getAxisFromDataKey(plotConfig, subStatDataKey);
                  if (axis === undefined) {
                    return null;
                  }
                  const { format, subName, inverseDataChangeDirectionColors } = axis;
                  const rawValue = datum[subStatDataKey];
                  const subStatFormatter = getFormatter(format);
                  const formattedValue = subStatFormatter(rawValue);
                  const dataChangeDirection = getDataChangeDirectionFromValue(rawValue);
                  return (
                    <SubStat
                      key={subStatDataKey}
                      direction={dataChangeDirection}
                      label={subName}
                      formattedValue={formattedValue}
                      inverseDataChangeDirectionColors={inverseDataChangeDirectionColors}
                    />
                  );
                })}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${(p) => (p.showBorder ? `${space.px} solid ${p.borderColor}` : 'none')};
  border-radius: ${radii.lg};
  padding: ${space[3]} ${space[4]};
`;

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

const SubStatList = styled.div`
  display: flex;
  column-gap: ${space[4]};
  margin-top: ${space[4]};
`;

const EnableOneStatMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default StatPlot;
