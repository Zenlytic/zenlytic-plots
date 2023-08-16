/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Legend } from 'recharts';
import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import space from '../../constants/space';
import {
  getLegendItemFormatter,
  getTickFormatterFromDataKey,
  getTooltipLabelDataKey,
} from '../../utils/plotConfigGetters';

const ZenlyticLegend = ({
  isServerSide = false,
  onLegendItemHover = () => {},
  onLegendItemLeave = () => {},
  margin,
  iconType = undefined,
  useStrokeColorShape,
  plotConfig,
  ...restProps
}) => {
  const formatter = getLegendItemFormatter(plotConfig);

  const legendItem = (value, entry) => {
    const strokeColor = entry?.payload?.stroke;
    const formattedValue = formatter(value);

    if (useStrokeColorShape) {
      return (
        <span>
          <span
            style={{
              color: strokeColor,
              height: '10px',
              width: '10px',
              backgroundColor: strokeColor,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              color: colors.gray[500],
              fontSize: fontSizes.xs,
              fontWeight: fontWeights.normal,
            }}>{` ${formattedValue}`}</span>
        </span>
      );
    }
    return (
      <span>
        <span
          style={{
            color: colors.gray[500],
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.normal,
          }}>{`${formattedValue}`}</span>
      </span>
    );
  };

  return (
    <Legend
      iconType={iconType}
      layout="vertical"
      align="right"
      verticalAlign={isServerSide ? 'top' : 'middle'}
      iconSize={useStrokeColorShape ? 0 : iconType === 'line' ? 14 : 12}
      color={colors.gray[500]}
      wrapperStyle={{
        paddingLeft: space[6],
        paddingBottom: margin.bottom,
        // Explicitly set to prevent legend items from taking up too much space
        // and expanding off the plot.
        maxHeight: '210px',
        overflow: 'auto',
      }}
      onMouseEnter={onLegendItemHover}
      onMouseLeave={onLegendItemLeave}
      isAnimationActive={true}
      formatter={legendItem}
      {...restProps}
    />
  );
};

ZenlyticLegend.propTypes = {};

export default ZenlyticLegend;
