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
  getStatPlotShowDataChangeDirectionColor,
  getStatPlotTextSize,
  getSubStatAxis,
  getSubStatDataKeys,
  getSubStatDatumByDataKey,
  getTickFormatterFromDataKey,
} from '../../utils/plotConfigGetters';
import {
  DATA_CHANGE_DIRECTIONS,
  PRIMARY_NUMBER_KEYS,
  TEXT_SIZE_TYPES,
} from '../../constants/plotConstants';

const directionToBorderColorMapping = {
  [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
  [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[60],
  [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
};

const getBorderColor = ({ direction, showDataChangeDirectionColor }) => {
  if (!showDataChangeDirectionColor) {
    return colors.gray[60];
  }
  return directionToBorderColorMapping[direction];
};

const directionToValueColorMapping = {
  [DATA_CHANGE_DIRECTIONS.POSITIVE]: colors.green[600],
  [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: colors.gray[700],
  [DATA_CHANGE_DIRECTIONS.NEGATIVE]: colors.red[600],
};

const getValueColor = ({ direction, showDataChangeDirectionColor }) => {
  if (!showDataChangeDirectionColor) {
    return colors.gray[700];
  }
  return directionToValueColorMapping[direction];
};

const getValueFontSize = ({ textSize, numMetrics }) => {
  const smallTextSize = fontSizes['2xl'];
  const largeTextSize = fontSizes['4xl'];
  const dynamicTextSize = numMetrics >= 3 ? smallTextSize : largeTextSize;

  return {
    [TEXT_SIZE_TYPES.DYNAMIC]: dynamicTextSize,
    [TEXT_SIZE_TYPES.SMALL]: smallTextSize,
    [TEXT_SIZE_TYPES.LARGE]: largeTextSize,
  }[textSize];
};

function StatPlot({ plotConfig = {} }) {
  const statDataKeys = getStatDataKeys(plotConfig);
  const numMetrics = statDataKeys.length;
  const showBorder = numMetrics !== 1;
  const subStatDataKeys = getSubStatDataKeys(plotConfig);
  const primaryNumberSubStatDataKey = getPrimaryNumberSubStatDataKey(plotConfig);
  const showDataChangeDirectionColor = getStatPlotShowDataChangeDirectionColor(plotConfig);
  const textSize = getStatPlotTextSize(plotConfig);

  const canShowPrimaryNumber = primaryNumberSubStatDataKey !== null;
  const subStatsToShowBelowPrimaryNumber = subStatDataKeys.filter(
    (subStatDataKey) => subStatDataKey !== primaryNumberSubStatDataKey
  );

  // console.log({ primaryNumberSubStatDataKey, subStatsToShowBelowPrimaryNumber });

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
        const {
          formatter,
          label: subStatLabel,
          direction,
        } = datum || { label: '', formatter: () => null };
        const percentFormatter = (value) => {
          return `${(value * 100).toFixed(1)}%`;
        };
        // TODO: NJM Rename omg
        let finalFormatter = formatter === 'Y_AXIS' ? tickFormatter : percentFormatter;
        if (typeof finalFormatter !== 'function') {
          finalFormatter = (value) => value;
        }
        const formattedValue = finalFormatter(value);
        const axisName = getAxisName(plotConfig, statDataKey);
        const showSubStats = subStatsToShowBelowPrimaryNumber.length > 0;

        const dataChangeDirectionSubDataKey = subStatDataKeys.find(
          (dataKey) => dataKey === '__PERCENTAGE_CHANGE' || dataKey === '__ABSOLUTE_DIFFERENCE'
        );

        const dataChangeDirectionDatum =
          dataChangeDirectionSubDataKey === undefined
            ? {}
            : getSubStatDatumByDataKey(plotConfig, statDataKey, dataChangeDirectionSubDataKey);

        const dataChangeDirection =
          dataChangeDirectionDatum.direction ?? DATA_CHANGE_DIRECTIONS.NO_CHANGE;

        const valueColor = getValueColor({
          showDataChangeDirectionColor,
          direction: dataChangeDirection,
        });
        const borderColor = getBorderColor({
          direction: dataChangeDirection,
          showDataChangeDirectionColor,
        });

        const valueFontSize = getValueFontSize({ textSize, numMetrics });

        console.log({
          valueColor,
          borderColor,
          showDataChangeDirectionColor,
          direction,
          dataChangeDirection,
          dataChangeDirectionDatum,
          dataChangeDirectionSubDataKey,
          subStatDataKeys,
        });

        return (
          <Stat showBorder={showBorder} borderColor={borderColor} key={statDataKey}>
            <Label>{axisName}</Label>
            <Value fontSize={valueFontSize} color={valueColor}>
              {formattedValue ?? '-'}
            </Value>
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
  // console.log({ formatterProps });

  if (subStatFormatter === undefined) {
    return null;
  }
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

const SubStatLabel = styled.div`
  color: ${colors.gray[300]};
  font-size: ${fontSizes['2xs']};
  font-weight: ${fontWeights.normal};
  line-height: 11px;
  margin-top: 4px;
`;

const Label = styled.div`
  color: ${colors.gray[700]};
  font-weight: ${fontWeights.normal};
  font-size: ${fontSizes.xs};
`;

const Value = styled.div`
  font-size: ${(p) => p.fontSize};
  margin-top: 8px;
  font-weight: ${fontWeights.bold};
  color: ${(p) => p.color};
`;

const SubStatList = styled.div`
  display: flex;
  column-gap: 16px;
  margin-top: 16px;
`;

const EnableOneStatMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default StatPlot;
