/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Legend } from 'recharts';
import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import { MAX_NUM_VISIBLE_LEGEND_ENTRIES } from '../../constants/plotConstants';
import space from '../../constants/space';
import { LegendIcon } from './LegendIcon';

const ZenlyticLegend = ({
  isServerSide = false,
  onLegendItemHover = () => {},
  onLegendItemLeave = () => {},
  margin,
  iconType = undefined,
  useStrokeColorShape,
  ...restProps
}) => {
  const renderLegend = (props) => {
    const { payload } = props;

    const visibleEntries = payload.slice(0, MAX_NUM_VISIBLE_LEGEND_ENTRIES);

    return (
      <ul style={{ listStyle: 'none' }}>
        {visibleEntries.map((entry, index) => (
          <li key={`item-${index}`} style={{ marginRight: '10px' }}>
            <LegendIcon type={iconType} color={entry.payload?.stroke} />
            <span
              style={{
                color: colors.gray[500],
                fontSize: fontSizes.xs,
                fontWeight: fontWeights.normal,
              }}>{` ${entry.value}`}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Legend
      iconType={iconType}
      layout="vertical"
      align="right"
      verticalAlign={isServerSide ? 'top' : 'middle'}
      color={colors.gray[500]}
      wrapperStyle={{
        paddingLeft: space[6],
        paddingBottom: margin.bottom,
      }}
      content={renderLegend}
      onMouseEnter={onLegendItemHover}
      onMouseLeave={onLegendItemLeave}
      isAnimationActive={!isServerSide}
      {...restProps}
    />
  );
};

ZenlyticLegend.propTypes = {};

export default ZenlyticLegend;
