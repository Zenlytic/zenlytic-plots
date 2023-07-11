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
import { getBorderDataChangeDirectionColor, getStaticTextSize } from './utils';

function StatPlot({ plotConfig = {} }) {
  const { primarySubStatDataKeys, secondarySubStatDataKeys } =
    getStatPlotSubMetricDataKeys(plotConfig);
  const data = getData(plotConfig);
  const numMetrics = getStatPlotNumMetrics(plotConfig);
  const showHighContrastDataChangeDirectionColor =
    getStatPlotShowHighContrastDataChangeDirectionColor(plotConfig);
  const textSize = getStatPlotTextSize(plotConfig);
  const staticTextSize = getStaticTextSize({ textSize, numMetrics });

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

        const dataChangeDirection = datum[DATA_CHANGE_DIRECTION];

        const borderColor = getBorderDataChangeDirectionColor({
          dataChangeDirection,
          showHighContrastDataChangeDirectionColor,
          inverseDataChangeDirectionColors,
        });

        const axis = getAxisFromDataKey(plotConfig, primarySubMetricDataKeyForDatum);

        if (axis === undefined) {
          return null;
        }

        const {
          format,
          name,
          subName,
          showDataChangeDirection,
          showHighContrastDataChangeDirectionColor: showHighContrastDataChangeDirectionColorForStat,
          inverseDataChangeDirectionColors,
        } = axis;

        const secondarySubStatDataKeysForDatum = datumEntries.filter((datumEntry) =>
          secondarySubStatDataKeys.includes(datumEntry)
        );

        const numSecondarySubStats = secondarySubStatDataKeysForDatum.length;

        const showSecondarySubStats = numSecondarySubStats > 0;

        const primarySubStatRawValue = datum[primarySubMetricDataKeyForDatum];

        const primarySubStatFormatter = getFormatter(format);

        const primarySubStatFormattedValue = primarySubStatFormatter(primarySubStatRawValue);

        return (
          <StatsContainer borderColor={borderColor} key={primarySubMetricDataKeyForDatum}>
            <SubStat
              dataChangeDirection={dataChangeDirection}
              topLabel={name}
              bottomLabel={subName}
              formattedValue={primarySubStatFormattedValue}
              showDataChangeDirection={showDataChangeDirection}
              showHighContrastDataChangeDirectionColor={
                showHighContrastDataChangeDirectionColor &&
                showHighContrastDataChangeDirectionColorForStat
              }
              inverseDataChangeDirectionColors={inverseDataChangeDirectionColors}
              statType="primary"
              staticTextSize={staticTextSize}
            />
            {showSecondarySubStats && (
              <SubStatList numSecondarySubStats={secondarySubStatDataKeysForDatum.length}>
                {secondarySubStatDataKeysForDatum.map(
                  (secondarySubStatDataKey, secondarySubStatIndex) => {
                    const axis = getAxisFromDataKey(plotConfig, secondarySubStatDataKey);

                    if (axis === undefined) {
                      return null;
                    }

                    const {
                      format,
                      subName,
                      showDataChangeDirection,
                      showHighContrastDataChangeDirectionColor:
                        showHighContrastDataChangeDirectionColorForSubStat,
                      inverseDataChangeDirectionColors,
                    } = axis;

                    const secondarySubStatRawValue = datum[secondarySubStatDataKey];

                    const secondarySubStatFormatter = getFormatter(format);

                    const secondarySubStatFormattedValue =
                      secondarySubStatFormatter(secondarySubStatRawValue);

                    return (
                      <SubStat
                        key={secondarySubStatDataKey}
                        dataChangeDirection={dataChangeDirection}
                        bottomLabel={subName}
                        formattedValue={secondarySubStatFormattedValue}
                        showDataChangeDirection={showDataChangeDirection}
                        showHighContrastDataChangeDirectionColor={
                          showHighContrastDataChangeDirectionColor &&
                          showHighContrastDataChangeDirectionColorForSubStat
                        }
                        inverseDataChangeDirectionColors={inverseDataChangeDirectionColors}
                        statType="secondary"
                        staticTextSize={staticTextSize}
                        numSecondarySubStats={numSecondarySubStats}
                        secondarySubStatIndex={secondarySubStatIndex}
                      />
                    );
                  }
                )}
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
  max-width: 100%;
  overflow: hidden;
`;

const SubStatList = styled.div`
  column-gap: ${space[4]};
  margin-top: ${space[4]};
  ${(p) => {
    if (p.numSecondarySubStats === 3) {
      return `
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: flex-end;
    `;
    }
    return `display: flex;`;
  }};
`;

const EnableOneStatMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default StatPlot;
