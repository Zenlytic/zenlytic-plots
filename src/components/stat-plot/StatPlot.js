/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styled from 'styled-components';
import { DATA_CHANGE_DIRECTION } from '../../constants/plotConstants';
import radii from '../../constants/radii';
import space from '../../constants/space';
import {
  getAxisFromDataKey,
  getData,
  getFormatter,
  getStatPlotNumMetrics,
  getStatPlotShowHighContrastDataChangeDirectionColor,
  getStatPlotSubMetricDataKeys,
  getStatPlotTextSize,
} from '../../utils/plotConfigGetters';
import SubStat from './components/sub-stat/SubStat';
import {
  getBorderColor,
  getDataChangeDirectionFromValue,
  getStaticTextSize,
  getValueColor,
  getValueFontSize,
} from './utils';

function StatPlot({ plotConfig = {} }) {
  const { primarySubStatDataKeys, secondarySubStatDataKeys } =
    getStatPlotSubMetricDataKeys(plotConfig);
  const data = getData(plotConfig);
  const numMetrics = getStatPlotNumMetrics(plotConfig);
  const showHighContrastDataChangeDirectionColor =
    getStatPlotShowHighContrastDataChangeDirectionColor(plotConfig);
  const textSize = getStatPlotTextSize(plotConfig);
  const staticTextSize = getStaticTextSize({ textSize, numMetrics });

  // Filter to data that has the minimum correct configuration, e.g. it has a primary number.
  // const dataWithPrimaryNumber = data.filter((datum) =>
  //   Object.keys(datum).some((datumEntry) => primarySubStatDataKeys.includes(datumEntry))
  // );

  // console.log({ data, primarySubStatDataKeys, dataWithPrimaryNumber });

  return (
    <StatsContainerList numMetrics={numMetrics}>
      {data.map((datum) => {
        const datumEntries = Object.keys(datum);

        const primarySubMetricDataKeyForDatum = datumEntries.find((datumEntry) =>
          primarySubStatDataKeys.includes(datumEntry)
        );

        if (primarySubMetricDataKeyForDatum === undefined) {
          return (
            <EnableOneStatMessage>
              Please enable at least one stat and select a primary number.
            </EnableOneStatMessage>
          );
        }

        const axis = getAxisFromDataKey(plotConfig, primarySubMetricDataKeyForDatum);

        if (axis === undefined) {
          return null;
        }

        const secondarySubStatDataKeysForDatum = datumEntries.filter((datumEntry) =>
          secondarySubStatDataKeys.includes(datumEntry)
        );

        const showSubStats = secondarySubStatDataKeysForDatum.length > 0;

        const primaryNumberValue = datum[primarySubMetricDataKeyForDatum];

        const valueFontSize = getValueFontSize({ textSize, numMetrics });

        const dataChangeDirection = datum[DATA_CHANGE_DIRECTION];

        const borderColor = getBorderColor({
          direction: dataChangeDirection,
          showHighContrastDataChangeDirectionColor,
        });

        const {
          format,
          name,
          subName,
          showDataChangeDirection,
          showHighContrastDataChangeDirectionColor: showHighContrastDataChangeDirectionColorForStat,
          inverseDataChangeDirectionColors,
        } = axis;

        const formatValue = getFormatter(format);
        const formattedValue = formatValue(primaryNumberValue);

        return (
          <StatsContainer borderColor={borderColor} key={primarySubMetricDataKeyForDatum}>
            <SubStat
              direction={dataChangeDirection}
              topLabel={name}
              bottomLabel={subName}
              formattedValue={formattedValue}
              showDataChangeDirection={showDataChangeDirection}
              showHighContrastDataChangeDirectionColor={
                showHighContrastDataChangeDirectionColor &&
                showHighContrastDataChangeDirectionColorForStat
              }
              inverseDataChangeDirectionColors={inverseDataChangeDirectionColors}
              statType="primary"
              fontSize={valueFontSize}
              staticTextSize={staticTextSize}
            />
            {showSubStats && (
              <SubStatList>
                {secondarySubStatDataKeysForDatum.map((subStatDataKey) => {
                  const axis = getAxisFromDataKey(plotConfig, subStatDataKey);
                  if (axis === undefined) {
                    return null;
                  }
                  const {
                    format,
                    subName,
                    inverseDataChangeDirectionColors,
                    showDataChangeDirection,
                    showHighContrastDataChangeDirection,
                  } = axis;
                  const rawValue = datum[subStatDataKey];
                  const subStatFormatter = getFormatter(format);
                  const formattedValue = subStatFormatter(rawValue);
                  const dataChangeDirection = getDataChangeDirectionFromValue(rawValue);
                  return (
                    <SubStat
                      key={subStatDataKey}
                      direction={dataChangeDirection}
                      bottomLabel={subName}
                      formattedValue={formattedValue}
                      showDataChangeDirection={showDataChangeDirection}
                      showHighContrastDataChangeDirectionColor={showHighContrastDataChangeDirection}
                      inverseDataChangeDirectionColors={inverseDataChangeDirectionColors}
                      statType="secondary"
                      staticTextSize={staticTextSize}
                    />
                  );
                })}
              </SubStatList>
            )}
          </StatsContainer>
        );
      })}
    </StatsContainerList>
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

const StatsContainerList = styled.div`
  display: grid;
  ${(p) => getStatGridCss(p.numMetrics)}
  gap: ${space[4]};
  height: 100%;
  padding: ${space[4]};
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${space.px} solid ${(p) => p.borderColor};
  border-radius: ${radii.lg};
  padding: ${space[3]} ${space[4]};
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
