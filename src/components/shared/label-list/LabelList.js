import React from 'react';
import { LabelList as RechartsLabelList } from 'recharts';

const Y_OFFSET = 8;

const getRenderCustomizedLabel =
  ({
    getSubLabelFromIndex,
    subLabelFontSize,
    subLabelFill,
    fontSize,
    fontWeight,
    formatter,
    fill,
  }) =>
  ({ x, y, width, value: rawValue, offset, index }) => {
    const formattedValue = formatter(rawValue);
    const positionedX = x + width / 2;
    const positionedY = y - Y_OFFSET;
    const subLabel = getSubLabelFromIndex({ index });

    return (
      <text
        x={positionedX}
        y={positionedY}
        offset={offset}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle">
        <tspan x={positionedX} dy="-16px" fill={fill}>
          {formattedValue}
        </tspan>
        <tspan x={positionedX} dy="14px" fontSize={subLabelFontSize} fill={subLabelFill}>
          {subLabel}
        </tspan>
      </text>
    );
  };

function LabelList({
  convertedPercentDataKey,
  dataKey,
  data,
  fill,
  subLabelFill,
  subLabelFontSize,
  fontSize,
  fontWeight,
  formatter,
  ...rest
}) {
  const getSubLabelFromIndex = ({ index }) => {
    const datum = data[index];
    const convertedPercentRawValue = datum[convertedPercentDataKey];
    const convertedPercentFormattedValue = `(${(convertedPercentRawValue * 100).toFixed(0)}%)`;
    return convertedPercentFormattedValue;
  };
  const renderCustomizedLabel = getRenderCustomizedLabel({
    fill,
    fontSize,
    fontWeight,
    formatter,
    subLabel: '(97%)',
    subLabelFontSize,
    subLabelFill,
    getSubLabelFromIndex,
  });
  return (
    <RechartsLabelList
      {...rest}
      content={renderCustomizedLabel}
      dataKey={dataKey}
      data={data}
      fill={fill}
      fontSize={fontSize}
      fontWeight={fontWeight}
      formatter={formatter}
    />
  );
}

export default LabelList;
