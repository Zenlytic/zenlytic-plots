/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BarChart, LabelList } from 'recharts';
import colors from '../../constants/colors';
import fontSizes from '../../constants/fontSizes';
import fontWeights from '../../constants/fontWeights';
import { DEFAULT_STROKE_WIDTH } from '../../constants/plotConstants';
import useTooltip from '../../hooks/useTooltip';
import Bar from '../shared/bar/Bar';

import { overrideAxisConfig } from '../../utils/overrideAxisConfig';
import {
  getCategoriesOfCategoryAxis,
  getData,
  getIsDataPivoted,
  getMargin,
  getPaletteColorByIndex,
  getSecondaryPaletteColorByIndex,
  getSeriesFillColor,
  getSeriesStrokeColor,
  getYAxis,
  getYAxisTickFormatter,
} from '../../utils/plotConfigGetters';
import GeneralChartComponents from '../general-chart-components/GeneralChartComponents';
import PlotContainer from '../plot-container/PlotContainer';

const STROKE_DASHARRAY = [5, 2];

const DEFAULT_LABEL_LIST_PROPS = {
  offset: 16,
  position: 'top',
  fill: colors.gray[500],
  subLabelFill: colors.gray[300],
  fontWeight: fontWeights.medium,
  fontSize: fontSizes.xs,
  subLabelFontSize: fontSizes['2xs'],
};

const Y_OFFSET = 8;

const getRenderCustomizedLabel =
  ({ getSubLabelFromIndex, formatter }) =>
  // eslint-disable-next-line react/function-component-definition
  ({ x, y, width, value: rawValue, index }) => {
    const formattedValue = formatter(rawValue);
    const positionedX = x + width / 2;
    const positionedY = y - Y_OFFSET;
    const subLabel = getSubLabelFromIndex({ index });

    return (
      <text
        x={positionedX}
        y={positionedY}
        offset={DEFAULT_LABEL_LIST_PROPS.offset}
        fontSize={DEFAULT_LABEL_LIST_PROPS.fontSize}
        fontWeight={DEFAULT_LABEL_LIST_PROPS.fontWeight}
        textAnchor="middle">
        <tspan x={positionedX} dy="-16px" fill={DEFAULT_LABEL_LIST_PROPS.fill}>
          {formattedValue}
        </tspan>
        <tspan
          x={positionedX}
          dy="14px"
          fontSize={DEFAULT_LABEL_LIST_PROPS.subLabelFontSize}
          fill={DEFAULT_LABEL_LIST_PROPS.subLabelFill}>
          {subLabel}
        </tspan>
      </text>
    );
  };

function PivotedFunnelBarPlot({ plotConfig, updateHoveredItemId, getSubLabelFromIndexAndDataKey }) {
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const categoriesOfCategoryAxis = getCategoriesOfCategoryAxis(plotConfig);
  return categoriesOfCategoryAxis.map((category, index) => {
    const { name: categoryName } = category;
    const convertedDataKey = `CONVERTED_${categoryName}`;
    const convertedPercentDataKey = `CONVERTED_PERCENT_${categoryName}`;
    const droppedOffDataKey = `DROPPED_OFF_${categoryName}`;

    const getSubLabelFromIndex = ({ index }) =>
      getSubLabelFromIndexAndDataKey({ index, dataKey: convertedPercentDataKey });

    const renderCustomizedLabel = getRenderCustomizedLabel({
      formatter: yAxisTickFormatter,
      getSubLabelFromIndex,
    });

    return (
      <>
        {Bar({
          id: droppedOffDataKey,
          isAnimationActive: false,
          stackId: categoryName,
          dataKey: droppedOffDataKey,
          name: `Dropped Off - ${categoryName}`,
          stroke: getPaletteColorByIndex(plotConfig, index),
          fill: getSecondaryPaletteColorByIndex(plotConfig, index),
          strokeWidth: DEFAULT_STROKE_WIDTH,
          strokeDasharray: STROKE_DASHARRAY,
          onMouseOver: () => updateHoveredItemId(droppedOffDataKey),
          onMouseLeave: () => updateHoveredItemId(null),
        })}
        {Bar({
          id: convertedDataKey,
          isAnimationActive: false,
          stackId: categoryName,
          dataKey: convertedDataKey,
          name: `Converted - ${categoryName}`,
          stroke: getPaletteColorByIndex(plotConfig, index),
          fill: getPaletteColorByIndex(plotConfig, index),
          strokeWidth: DEFAULT_STROKE_WIDTH,
          onMouseOver: () => updateHoveredItemId(convertedDataKey),
          onMouseLeave: () => updateHoveredItemId(null),
          children: (
            <LabelList
              {...DEFAULT_LABEL_LIST_PROPS}
              dataKey={convertedDataKey}
              convertedPercentDataKey={convertedPercentDataKey}
              content={renderCustomizedLabel}
              formatter={yAxisTickFormatter}
            />
          ),
        })}
      </>
    );
  });
}

const CONVERTED_DATA_KEY = 'CONVERTED';
const CONVERTED_PERCENT_DATA_KEY = 'CONVERTED_PERCENT';
const DROPPED_OFF_DATA_KEY = 'DROPPED_OFF';

function NonPivotedFunnelBarPlot({
  plotConfig,
  updateHoveredItemId,
  getSubLabelFromIndexAndDataKey,
}) {
  const seriesStrokeColor = getSeriesStrokeColor(plotConfig);
  const seriesFillColor = getSeriesFillColor(plotConfig);
  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const getSubLabelFromIndex = ({ index }) =>
    getSubLabelFromIndexAndDataKey({ index, dataKey: CONVERTED_PERCENT_DATA_KEY });

  const renderCustomizedLabel = getRenderCustomizedLabel({
    getSubLabelFromIndex,
    formatter: yAxisTickFormatter,
  });

  return (
    <>
      {Bar({
        isAnimationActive: false,
        id: DROPPED_OFF_DATA_KEY,
        name: 'Dropped Off',
        dataKey: DROPPED_OFF_DATA_KEY,
        fill: seriesFillColor,
        stroke: seriesStrokeColor,
        strokeWidth: DEFAULT_STROKE_WIDTH,
        strokeDasharray: STROKE_DASHARRAY,
        stackId: 'a',
        onMouseOver: () => updateHoveredItemId(DROPPED_OFF_DATA_KEY),
        onMouseLeave: () => updateHoveredItemId(null),
      })}
      {Bar({
        isAnimationActive: false,
        id: CONVERTED_DATA_KEY,
        name: 'Converted',
        dataKey: CONVERTED_DATA_KEY,
        fill: seriesStrokeColor,
        stackId: 'a',
        strokeWidth: DEFAULT_STROKE_WIDTH,
        onMouseOver: () => updateHoveredItemId(CONVERTED_DATA_KEY),
        onMouseLeave: () => updateHoveredItemId(null),
        children: (
          <LabelList
            {...DEFAULT_LABEL_LIST_PROPS}
            dataKey={CONVERTED_DATA_KEY}
            content={renderCustomizedLabel}
            formatter={yAxisTickFormatter}
          />
        ),
      })}
    </>
  );
}

function FunnelBarPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  const data = getData(plotConfig);
  const margin = getMargin(plotConfig);

  const yAxisConfig = getYAxis(plotConfig);

  const isDataPivoted = getIsDataPivoted(plotConfig);

  const [tooltip, tooltipHandlers] = useTooltip();

  const { updateHoveredItemId } = tooltipHandlers || {};
  const { hoveredItemId = null } = tooltip || {};

  const yAxisTickFormatter = getYAxisTickFormatter(plotConfig);

  const getSubLabelFromIndexAndDataKey = ({ index, dataKey }) => {
    const datum = data[index];
    const convertedPercentRawValue = datum[dataKey];
    const convertedPercentFormattedValue = `(${(convertedPercentRawValue * 100).toFixed(0)}%)`;
    return convertedPercentFormattedValue;
  };

  return (
    <PlotContainer>
      <BarChart data={data} margin={margin} barGap={6} reverseStackOrder>
        {GeneralChartComponents({
          plotConfig,
          yAxisConfig: overrideAxisConfig(yAxisConfig, { dataKey: undefined }),
          TooltipContent,
          tooltipHandlers,
          tooltip,
          isFollowUpDisabled,
          customValueFormatter: yAxisTickFormatter,
        })}
        {isDataPivoted &&
          PivotedFunnelBarPlot({ plotConfig, updateHoveredItemId, getSubLabelFromIndexAndDataKey })}
        {!isDataPivoted &&
          NonPivotedFunnelBarPlot({
            plotConfig,
            updateHoveredItemId,
            hoveredItemId,
            getSubLabelFromIndexAndDataKey,
          })}
      </BarChart>
    </PlotContainer>
  );
}

FunnelBarPlot.propTypes = {};

export default FunnelBarPlot;
