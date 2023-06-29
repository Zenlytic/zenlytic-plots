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
  getAxisFromAxes,
  getAxisFromDataKey,
  getAxisName,
  getData,
  getFormatter,
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
import { FiArrowUpRight, FiArrowDownRight, FiArrowDown } from 'react-icons/fi';

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
  // console.log(plotConfig);
  const series = getSeries(plotConfig);
  const { mainMetricDataKeys, subMetricDataKeys } = series;
  const data = getData(plotConfig);
  const statDataKeys = getStatDataKeys(plotConfig);
  const numMetrics = data.length;
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
      {data.map((datum) => {
        // const tickFormatter = getTickFormatterFromDataKey(plotConfig, datum);
        // const datum = getSubStatDatumByDataKey(plotConfig, datum, primaryNumberSubStatDataKey);
        // const value = datum[datum];
        // const {
        //   formatter,
        //   label: subStatLabel,
        //   direction,
        // } = datum || { label: '', formatter: () => null };
        // const percentFormatter = (value) => {
        //   return `${(value * 100).toFixed(1)}%`;
        // };
        // // TODO: NJM Rename omg
        // let finalFormatter = formatter === 'Y_AXIS' ? tickFormatter : percentFormatter;
        // if (typeof finalFormatter !== 'function') {
        //   finalFormatter = (value) => value;
        // }
        // const formattedValue = finalFormatter(value);
        // const axisName = getAxisName(plotConfig, datum);

        // const dataChangeDirectionSubDataKey = subStatDataKeys.find(
        //   (dataKey) => dataKey === '__PERCENTAGE_CHANGE' || dataKey === '__ABSOLUTE_DIFFERENCE'
        // );

        // const dataChangeDirectionDatum =
        //   dataChangeDirectionSubDataKey === undefined
        //     ? {}
        //     : getSubStatDatumByDataKey(plotConfig, datum, dataChangeDirectionSubDataKey);

        // const dataChangeDirection =
        //   dataChangeDirectionDatum.direction ?? DATA_CHANGE_DIRECTIONS.NO_CHANGE;

        // TODO: NJM take in the actual direction
        const dataChangeDirection = DATA_CHANGE_DIRECTIONS.POSITIVE;

        const valueColor = getValueColor({
          showDataChangeDirectionColor,
          direction: dataChangeDirection,
        });
        const borderColor = getBorderColor({
          direction: dataChangeDirection,
          showDataChangeDirectionColor,
        });

        const valueFontSize = getValueFontSize({ textSize, numMetrics });

        const datumEntries = Object.keys(datum);
        const primaryNumberDatumEntry = datumEntries.find((datumEntry) =>
          mainMetricDataKeys.includes(datumEntry)
        );
        const subStatDataEntries = datumEntries.filter(
          (datumEntry) => !mainMetricDataKeys.includes(datumEntry)
        );
        const showSubStats = subStatDataEntries.length > 0;
        const primaryNumberValue = datum[primaryNumberDatumEntry];
        const axis = getAxisFromDataKey(plotConfig, primaryNumberDatumEntry);

        if (axis === undefined) {
          return null;
        }
        const { format, name, subName } = axis;
        const formatValue = getFormatter(format);
        const formattedValue = formatValue(primaryNumberValue);
        // return null;
        return (
          <Stat showBorder={showBorder} borderColor={borderColor} key={primaryNumberDatumEntry}>
            <Label>{name}</Label>
            <Value fontSize={valueFontSize} color={valueColor}>
              {formattedValue ?? '-'}
            </Value>
            <SubStatLabel>{subName}</SubStatLabel>
            {showSubStats && (
              // TODO: NJM think I need to differentiate more between subStatDataKeys
              // and subStatDataKey, like obviously pick different names
              <SubStatList>
                {subStatDataEntries.map((subStatDataKey) => {
                  const axis = getAxisFromDataKey(plotConfig, subStatDataKey);
                  if (axis === undefined) {
                    return null;
                  }
                  const { format, name, subName, direction, inverseDataChangeDirectionColors } =
                    axis;
                  const rawValue = datum[subStatDataKey];
                  const subStatFormatter = getFormatter(format);
                  const formattedValue = subStatFormatter(rawValue);
                  return (
                    <SubStat
                      key={subStatDataKey}
                      direction={direction}
                      color="green"
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

function SubStat({ direction, label, formattedValue, inverseDataChangeDirectionColors }) {
  // TODO: NJM make this passed in
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

  const finalColor = inverseDataChangeDirectionColors ? inversedColor : color;

  // TODO: NJM Make this look nice / match ComparePeriod.tsx
  const icon = {
    [DATA_CHANGE_DIRECTIONS.POSITIVE]: <FiArrowUpRight color={finalColor} />,
    [DATA_CHANGE_DIRECTIONS.NO_CHANGE]: null,
    [DATA_CHANGE_DIRECTIONS.NEGATIVE]: <FiArrowDownRight color={finalColor} />,
  }[direction];

  return (
    <SubStatContainer>
      <IconValueContainer>
        {icon}
        <SubStatValue color={finalColor}>{formattedValue}</SubStatValue>
      </IconValueContainer>
      <SubStatLabel>{label}</SubStatLabel>
    </SubStatContainer>
  );
  // return subStatFormatter(formatterProps);
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

const SubStatLabel = styled.div`
  color: ${colors.gray[300]};
  font-size: ${fontSizes['2xs']};
  font-weight: ${fontWeights.normal};
  line-height: 11px;
  margin-top: 4px;
`;

const SubStatValue = styled.span`
  color: ${(p) => p.color};
  font-size: ${fontSizes['2xs']};
`;

const IconValueContainer = styled.div`
  display: flex;
  column-gap: 4px;
`;

const SubStatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
