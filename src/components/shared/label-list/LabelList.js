import React from 'react';
import { LabelList as RechartsLabelList } from 'recharts';

const Y_OFFSET = 8;

const getRenderCustomizedLabel =
  ({ subLabel, subLabelFontSize, subLabelFill, fontSize, fontWeight, formatter, fill }) =>
  ({ x, y, width, value: rawValue, offset, ...rest }) => {
    const formattedValue = formatter(rawValue);
    const positionedX = x + width / 2;
    const positionedY = y - Y_OFFSET;
    return (
      <text
        x={positionedX}
        y={positionedY}
        offset={offset}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
        fill={fill}>
        <tspan x={positionedX} dy="-16px">
          {formattedValue}
        </tspan>
        <tspan x={positionedX} dy="14px" fontSize={subLabelFontSize} fill={subLabelFill}>
          {subLabel}
        </tspan>
      </text>
    );
  };

function LabelList({
  sumDataKeys,
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
  //   const renderCustomizedLabelMemoized = useCallback(renderCustomizedLabel, []);
  //   const renderCustomizedLabelUseMemo = useCallback(renderCustomizedLabel, []);

  const renderCustomizedLabel = getRenderCustomizedLabel({
    fill,
    fontSize,
    fontWeight,
    formatter,
    subLabel: '(97%)',
    subLabelFontSize,
    subLabelFill,
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
