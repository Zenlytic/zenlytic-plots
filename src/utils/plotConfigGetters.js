import { isEmpty } from 'lodash';
import colors from '../constants/colors';
import {
  AXIS_DATA_KEY_KEYS,
  DATA_CHANGE_TYPES,
  DEFAULT_PLOT_MARGIN,
  DEFAULT_Y_AXIS_WIDTH,
  GROUPED_BAR_DISPLAY_TYPES,
  PLOT_TYPES,
  RADIAL_PLOT_DISPLAY_TYPES,
  TEXT_SIZE_TYPES,
} from '../constants/plotConstants';
import formatValue from './formatValue';
import getD3DataFormatter from './getD3DataFormatter';

export const getAxes = (plotConfig = {}) => {
  return plotConfig.axes || [];
};

export const getSeries = (plotConfig = {}) => {
  const { series = [] } = plotConfig;
  if (!series.length) return null;
  return series[0];
};

export const getReferenceLineValue = (plotConfig = {}) => {
  const series = getSeries(plotConfig);
  return series?.referenceLineValue;
};

export const getSeriesType = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { type } = series || {};
  return type;
};

export const getSeriesActiveIds = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { activeIds } = series || {};
  return activeIds;
};

export const getSeriesShowDataAnnotations = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { showDataAnnotations = false } = series;
  return showDataAnnotations;
};

export const getSeriesRotateXAxis = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { rotateXAxis = false } = series;
  return rotateXAxis;
};

export const getSeriesHiddenColumns = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { hiddenColumns = [] } = series;
  return hiddenColumns;
};

export const getFormatter = (format) => {
  return (value) => {
    return formatValue(getD3DataFormatter(format, value), value);
  };
};

const getSeriesKeyValue = (plotConfig, axisDataKeyKey) => {
  const series = getSeries(plotConfig);
  if (!series) return null;
  return series[axisDataKeyKey];
};

export const getAxisFromDataKey = (plotConfig, axisDataKey) => {
  const axes = getAxes(plotConfig);
  return axes.find((axis) => axis.dataKey === axisDataKey);
};

export const getAxisFormat = (plotConfig, dataKey) => {
  const axis = getAxisFromDataKey(plotConfig, dataKey);
  return axis?.format;
};

export const getAxisName = (plotConfig, dataKey) => {
  const axis = getAxisFromDataKey(plotConfig, dataKey);
  return axis?.name;
};

export const getTickFormatterFromDataKey = (plotConfig, dataKey) => {
  const axisFormat = getAxisFormat(plotConfig, dataKey);
  return getFormatter(axisFormat);
};

const getRadialPlotLegendItemFormatter = (plotConfig) => {
  const tooltipLabelDataKey = getTooltipLabelDataKey(plotConfig);

  const formatter = getTickFormatterFromDataKey(plotConfig, tooltipLabelDataKey);
  return formatter;
};

export const getLegendItemFormatter = (plotConfig) => {
  const plotType = getSeriesType(plotConfig);
  const defaultFormatter = (value) => value;
  switch (plotType) {
    case PLOT_TYPES.DONUT:
    case PLOT_TYPES.PIE:
      return getRadialPlotLegendItemFormatter(plotConfig);
    default:
      return defaultFormatter;
  }
};

export const getXAxisDataKey = (plotConfig) => {
  const xAxisDataKey = getSeriesKeyValue(plotConfig, AXIS_DATA_KEY_KEYS.X_AXIS_DATA_KEY_KEY);
  return xAxisDataKey;
};

export const getYAxisDataKey = (plotConfig) => {
  const yAxisDataKey = getSeriesKeyValue(plotConfig, AXIS_DATA_KEY_KEYS.Y_AXIS_DATA_KEY_KEY);
  return yAxisDataKey;
};

const getAxisFromAxes = (plotConfig, axisDataKeyKey) => {
  const axisDataKey = getSeriesKeyValue(plotConfig, axisDataKeyKey);
  return getAxisFromDataKey(plotConfig, axisDataKey);
};

// Used in grouped bar to define the x axis
export const getCategoryAxis = (plotConfig) => {
  const categoryAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.CATEGORY_AXIS_DATA_KEY_KEY);

  if (!categoryAxis) return {};
  const { dataType, name, dataKey, format } = categoryAxis || {};
  const tickFormatter = getFormatter(format);
  return { type: dataType, name, dataKey, tickFormatter };
};

export const getCategoryAxisFormatter = (plotConfig) => {
  const categoryAxis = getCategoryAxis(plotConfig);
  return categoryAxis?.tickFormatter;
};

export const getIsDataPivoted = (plotConfig) => {
  const categoryAxis = getCategoryAxis(plotConfig);
  return !isEmpty(categoryAxis);
};

export const getRawData = (plotConfig) => {
  const { data = [] } = plotConfig;
  return data;
};

// We use this to show all of the points if possible.
// If we can't show everything, then we just let Recharts to it.
export const getXAxisInterval = (plotConfig, width) => {
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const rotateXAxis = getSeriesRotateXAxis(plotConfig);
  if (isDataPivoted || !rotateXAxis) {
    return 'preserveEnd';
  }
  if (width) {
    const data = getRawData(plotConfig);
    const dataLength = data.length;
    return width - dataLength * 14 > 0 ? 0 : 'preserveEnd';
  }
  return 'preserveEnd';
};

// We use this to show all of the points if possible..
// If we can't show everything, then we just let Recharts to it.
export const getYAxisInterval = (plotConfig, height) => {
  const isDataPivoted = getIsDataPivoted(plotConfig);
  if (isDataPivoted) {
    return 'preserveEnd';
  }
  if (height) {
    const data = getRawData(plotConfig);
    const dataLength = data.length;
    return height - dataLength * 14 > 0 ? 0 : 'preserveEnd';
  }
  return 'preserveEnd';
};

export const getXAxis = (plotConfig) => {
  const xAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.X_AXIS_DATA_KEY_KEY);
  const seriesType = getSeriesType(plotConfig);
  if (!xAxis) return {};
  const { dataType, name, dataKey, format } = xAxis || {};
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const tickFormatter = getFormatter(format);
  const rotateXAxis = getSeriesRotateXAxis(plotConfig);
  const interval = getXAxisInterval(plotConfig);
  return {
    type: dataType,
    name,
    dataKey,
    tickFormatter,
    rotateXAxis,
    interval,
    allowDuplicatedCategory:
      [PLOT_TYPES.FUNNEL_BAR, PLOT_TYPES.GROUPED_BAR].includes(seriesType) || !isDataPivoted,
  };
};

export const getXAxisTickFormatter = (plotConfig) => {
  const xAxis = getXAxis(plotConfig);
  return xAxis?.tickFormatter;
};

export const getXAxisName = (plotConfig) => {
  const xAxis = getXAxis(plotConfig);
  return xAxis?.name;
};

export const getSecondYAxis = (plotConfig) => {
  const secondYAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.SECOND_Y_AXIS_DATA_KEY_KEY);
  const domain = getSecondYAxisDomainWithFallback(plotConfig);
  if (!secondYAxis) return { domain };
  const { dataType, name, dataKey, format } = secondYAxis || {};
  const tickFormatter = getFormatter(format);
  const tickMaxLength = getYAxisMaxDataWidth(plotConfig, {
    tickFormatter,
    yAxisDataKey: dataKey,
  });
  const useWideYAxis = false;
  const width = getYAxisWidth({ useWideYAxis, tickMaxLength });
  return {
    type: dataType,
    name,
    dataKey,
    tickFormatter,
    yAxisId: 'right',
    orientation: 'right',
    width,
    domain,
    useWideYAxis,
    tickMaxLength,
  };
};

export const getSecondYAxisTickFormatter = (plotConfig) => {
  const secondYAxis = getSecondYAxis(plotConfig);
  return secondYAxis.tickFormatter;
};

export const getSecondYAxisName = (plotConfig) => {
  const secondYAxis = getSecondYAxis(plotConfig);
  return secondYAxis?.name;
};

export const getSecondYAxisDataKey = (plotConfig) => {
  const secondYAxis = getSecondYAxis(plotConfig);
  return secondYAxis?.dataKey;
};

export const getIsSplitAxes = (plotConfig) => {
  return !!getSecondYAxisDataKey(plotConfig);
};

const getYAxisMaxDataWidth = (plotConfig, { tickFormatter, yAxisDataKey }) => {
  const plotType = getSeriesType(plotConfig);

  const shouldLimitYAxisWidth = [
    PLOT_TYPES.LINE,
    PLOT_TYPES.MULTI_LINE,
    PLOT_TYPES.BAR,
    PLOT_TYPES.GROUPED_BAR,
    PLOT_TYPES.AREA,
  ].includes(plotType);

  if (!shouldLimitYAxisWidth) {
    return null;
  }

  const data = getData(plotConfig);

  const isDataPivoted = getIsDataPivoted(plotConfig);

  const categoryValueDataKeys = getUniqueValuesOfCategoryAxis(plotConfig);

  const formattedValuesMaxLength = data.reduce((agg, datum) => {
    let rawValue;
    if (
      [PLOT_TYPES.BAR, PLOT_TYPES.LINE, PLOT_TYPES.HORIZONTAL_BAR].includes(plotType) ||
      !isDataPivoted
    ) {
      rawValue = datum[yAxisDataKey];
    } else if (
      [PLOT_TYPES.MULTI_LINE, PLOT_TYPES.GROUPED_BAR, PLOT_TYPES.AREA].includes(plotType) &&
      isDataPivoted
    ) {
      rawValue = categoryValueDataKeys.reduce((agg, currentCategoryValueDataKey) => {
        const rawCategoryValue = datum[currentCategoryValueDataKey];
        return Math.max(agg, rawCategoryValue);
      }, 0);
    }
    const formattedValue = tickFormatter(rawValue);
    const formattedValueLength = formattedValue?.toString().length ?? 0;
    return Math.max(agg, formattedValueLength);
  }, 0);

  return formattedValuesMaxLength;
};

const getYAxisWidth = ({ useWideYAxis, tickMaxLength }) => {
  if (useWideYAxis) {
    return 200;
  }

  if (tickMaxLength > 9) {
    return 130;
  }
  return useWideYAxis ? 200 : DEFAULT_Y_AXIS_WIDTH;
};

export const getYAxis = (plotConfig) => {
  const plotType = getSeriesType(plotConfig);
  const domain = getYAxisDomainWithFallback(plotConfig);
  const yAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.Y_AXIS_DATA_KEY_KEY);

  const defaultTickFormatter = getFormatter('decimal_0');

  // Not all plotTypes will have a column associated with the yAxis,
  // but we still want to return Recharts-centric yAxis information like domain.
  if (!yAxis) return { domain, tickFormatter: defaultTickFormatter };

  const { dataType, name, dataKey, format } = yAxis || {};
  const isSplitAxes = getIsSplitAxes(plotConfig);
  const useWideYAxis = plotType === PLOT_TYPES.HORIZONTAL_BAR;

  const tickFormatter = getFormatter(format);

  const tickMaxLength = getYAxisMaxDataWidth(plotConfig, {
    tickFormatter,
    yAxisDataKey: dataKey,
  });

  const width = getYAxisWidth({ useWideYAxis, tickMaxLength });

  return {
    type: dataType,
    name,
    dataKey,
    tickFormatter,
    yAxisId: isSplitAxes ? 'left' : undefined,
    orientation: isSplitAxes ? 'left' : undefined,
    domain,
    width,
    useWideYAxis,
    tickMaxLength,
  };
};

export const getYAxisTickFormatter = (plotConfig) => {
  const yAxis = getYAxis(plotConfig);
  return yAxis.tickFormatter;
};

export const getYAxisName = (plotConfig) => {
  const yAxis = getYAxis(plotConfig);
  return yAxis?.name;
};

export const getYAxisId = (plotConfig) => {
  if (getSecondYAxisDataKey(plotConfig)) {
    return 'left';
  }
  return undefined;
};

export const getSecondYAxisId = (plotConfig) => {
  return 'right';
};

export const getZAxis = (plotConfig) => {
  const zAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.Z_AXIS_DATA_KEY_KEY);
  if (!zAxis) return {};
  const { dataType, name, dataKey, format } = zAxis || {};

  const tickFormatter = getFormatter(format);
  return { type: dataType, name, dataKey, tickFormatter };
};

export const getZAxisTickFormatter = (plotConfig) => {
  const zAxis = getZAxis(plotConfig);
  return zAxis.tickFormatter;
};

export const getZAxisDataKey = (plotConfig) => {
  const zAxis = getZAxis(plotConfig);
  return zAxis?.dataKey;
};
export const getZAxisName = (plotConfig) => {
  const zAxis = getZAxis(plotConfig);
  return zAxis?.name;
};

export const getCategoryAxisDataKey = (plotConfig) => {
  const categoryAxis = getCategoryAxis(plotConfig);
  return categoryAxis?.dataKey;
};

export const getUniqueValuesOfDataKey = (plotConfig, dataKey) => {
  const { data = [] } = plotConfig;
  return [...new Set(data.map((item) => item[dataKey]))].sort();
};

const getUniqueValuesOfCategoryAxis = (plotConfig) => {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const categories = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  return categories;
};

export const getCategoriesOfCategoryAxis = (plotConfig) => {
  const categories = getUniqueValuesOfCategoryAxis(plotConfig);
  return categories.map((category) => {
    return { name: category, dataKey: category };
  });
};

const getCategoryValueDataKeys = (plotConfig) => {
  const categoryValueDataKeys = getSeriesKeyValue(
    plotConfig,
    AXIS_DATA_KEY_KEYS.CATEGORY_VALUE_DATA_KEYS_KEY
  );
  return categoryValueDataKeys ?? [];
};

export const getCategoryValueAxes = (plotConfig) => {
  // Used if we should use the categories of a certain axis as the legend items
  if (getCategoryAxisDataKey(plotConfig)) {
    return getCategoriesOfCategoryAxis(plotConfig).sort(sortBySeriesName);
  }
  const categoryValueDataKeys = getCategoryValueDataKeys(plotConfig);
  if (!categoryValueDataKeys || !categoryValueDataKeys.length) return null;
  return categoryValueDataKeys
    .map((categoryValueDataKey) => {
      const categoryValue = getAxisFromDataKey(plotConfig, categoryValueDataKey);
      const { dataType, name, dataKey, format } = categoryValue || {};
      const tickFormatter = getFormatter(format);
      return { type: dataType, name, dataKey, tickFormatter };
    })
    .sort(sortBySeriesName);
};

export const getCategoryValueAxisByDataKey = (plotConfig, dataKey) => {
  const categoryValueAxes = getCategoryValueAxes(plotConfig);
  return categoryValueAxes.find((axis) => axis.dataKey === dataKey);
};

// TODO refactor the bar stuff and anything else using this to use the new function
export const getCategoryValues = (plotConfig) => {
  const categoryValueDataKeys = getSeriesKeyValue(
    plotConfig,
    AXIS_DATA_KEY_KEYS.CATEGORY_VALUE_DATA_KEYS_KEY
  );
  if (!categoryValueDataKeys || !categoryValueDataKeys.length) return null;
  return categoryValueDataKeys.map((categoryValueDataKey) => {
    const categoryValue = getAxisFromDataKey(plotConfig, categoryValueDataKey);
    const { dataType, name, dataKey, format } = categoryValue || {};
    const tickFormatter = getFormatter(format);
    return { type: dataType, name, dataKey, tickFormatter };
  });
};

const flatPivotDataByDataKey = (plotConfig, data, dataKey) => {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);

  let dataDict = {};
  data.forEach((item) => {
    const dataKeyValue = item[dataKey];
    const xAxisKeyValue = item[xAxisDataKey];
    const yAxisKeyValue = item[yAxisDataKey];

    if (!dataDict[xAxisKeyValue]) {
      dataDict[xAxisKeyValue] = {
        [dataKeyValue]: yAxisKeyValue,
      };
    }
    dataDict[xAxisKeyValue][dataKeyValue] = yAxisKeyValue;
  });

  return Object.keys(dataDict).map((key) => {
    return { [xAxisDataKey]: key, ...dataDict[key] };
  });
};

const nestedPivotDataByDataKey = (plotConfig, data, dataKey) => {
  let dataDict = {};
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const uniqueCategoryValues = getUniqueValuesOfDataKey(plotConfig, xAxisDataKey);
  data.forEach((item) => {
    const dataKeyValue = item[dataKey];
    if (!dataDict[dataKeyValue]) {
      dataDict[dataKeyValue] = [];
    }
    dataDict[dataKeyValue].push(item);
  });

  return Object.keys(dataDict).map((key) => {
    return {
      name: key,
      data: dataDict[key].sort((a, b) =>
        uniqueCategoryValues.indexOf(a[xAxisDataKey]) <
        uniqueCategoryValues.indexOf(b[xAxisDataKey])
          ? -1
          : 1
      ),
    };
  });
};

const RADIAL_PLOT_TYPES = [PLOT_TYPES.DONUT, PLOT_TYPES.PIE];

const getPlotDimensionsType = (plotConfig) => {
  const plotType = getSeriesType(plotConfig);
  return RADIAL_PLOT_TYPES.includes(plotType) ? 'radial' : 'cartesian';
};

export const getIsCartesianPlot = (plotConfig) => {
  const plotDimensionsType = getPlotDimensionsType(plotConfig);
  return plotDimensionsType === 'cartesian';
};

export const getIsRadialPlot = (plotConfig) => {
  const plotDimensionsType = getPlotDimensionsType(plotConfig);
  return plotDimensionsType === 'radial';
};

export const getStatPlotNumMetrics = (plotConfig) => {
  const data = getData(plotConfig);
  return data.length;
};

export const getStatPlotSubMetricDataKeys = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { primarySubStatDataKeys, secondarySubStatDataKeys } = series;
  return { primarySubStatDataKeys, secondarySubStatDataKeys };
};

export const pivotDataByDataKey = (plotConfig, data, dataKey) => {
  const plotType = getSeriesType(plotConfig);
  if (plotType === PLOT_TYPES.AREA) return flatPivotDataByDataKey(plotConfig, data, dataKey);
  return nestedPivotDataByDataKey(plotConfig, data, dataKey);
};

const getPivotedData = (plotConfig, data) => {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const pivotedData = pivotDataByDataKey(plotConfig, data, categoryAxisDataKey).sort(
    sortBySeriesName
  );
  return pivotedData;
};

const getPivotedFunnelSpecificData = (plotConfig, data) => {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const xAxisDataKey = getXAxisDataKey(plotConfig);

  const pivotedData = getPivotedData(plotConfig, data);

  const yAxisDataKey = getYAxisDataKey(plotConfig);

  let newNewData = [];

  pivotedData.forEach((series) => {
    const { name: seriesName, data: seriesData } = series;
    const calculatedDataPoint = [];
    let previousValue = 0;
    seriesData.forEach((d, index) => {
      const convertedValue = d[yAxisDataKey];
      const droppedOffValue = index === 0 ? 0 : previousValue - d[yAxisDataKey];
      const totalValue = convertedValue + droppedOffValue;
      const convertedPercent = totalValue === 0 ? 0 : convertedValue / totalValue;
      calculatedDataPoint.push({
        [xAxisDataKey]: d[xAxisDataKey],
        [`CONVERTED_${seriesName}`]: convertedValue,
        [`DROPPED_OFF_${seriesName}`]: droppedOffValue,
        [`CONVERTED_PERCENT_${seriesName}`]: convertedPercent,
      });
      previousValue = d[yAxisDataKey];
    });
    newNewData = [...newNewData, ...calculatedDataPoint];
  });
  const newNewPivotedData = pivotDataByDataKey(plotConfig, newNewData, xAxisDataKey);

  const flattenedNewNewPivotedData = [];
  newNewPivotedData.forEach((series) => {
    const { name: seriesName, data: seriesData } = series;
    let flattenedSeries = {};
    seriesData.forEach((d) => {
      flattenedSeries = { ...flattenedSeries, ...d };
    });
    flattenedNewNewPivotedData.push(flattenedSeries);
  });
  return flattenedNewNewPivotedData;
};

const getNonPivotedFunnelSpecificData = (plotConfig, data) => {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const newData = [];
  let previousValue = 0;
  data.forEach((d, index) => {
    const convertedValue = d[yAxisDataKey];
    const droppedOffValue = index === 0 ? 0 : previousValue - d[yAxisDataKey];
    const totalValue = convertedValue + droppedOffValue;
    const convertedPercent = totalValue === 0 ? 0 : convertedValue / totalValue;
    newData.push({
      ...d,
      CONVERTED: convertedValue,
      DROPPED_OFF: droppedOffValue,
      CONVERTED_PERCENT: convertedPercent,
    });
    previousValue = convertedValue;
  });
  return newData;
};

const getGroupedBarSpecificData = (plotConfig, data, isDataPivoted) => {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const pivotedData = pivotDataByDataKey(plotConfig, data, xAxisDataKey);
  const formattedPivotedData = pivotedData.map((datum) => {
    const builtData = datum.data.reduce((aggregate, currentDatum) => {
      const categoryAxisValue = currentDatum[categoryAxisDataKey];
      const yAxisValue = currentDatum[yAxisDataKey];
      aggregate[categoryAxisValue] = yAxisValue;
      return aggregate;
    }, {});
    return {
      [xAxisDataKey]: datum.name,
      ...builtData,
    };
  });

  return isDataPivoted ? formattedPivotedData : data;
};

const getMultilineSpecificData = (plotConfig, data, isDataPivoted) => {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const pivotedData = pivotDataByDataKey(plotConfig, data, xAxisDataKey);
  const formattedPivotedData = pivotedData.map((datum) => {
    const builtData = datum.data.reduce((aggregate, currentDatum) => {
      const categoryAxisValue = currentDatum[categoryAxisDataKey];
      const yAxisValue = currentDatum[yAxisDataKey];
      aggregate[categoryAxisValue] = yAxisValue;
      return aggregate;
    }, {});
    return {
      [xAxisDataKey]: datum.name,
      ...builtData,
    };
  });

  return isDataPivoted ? formattedPivotedData : data;
};

const getFunnelSpecificData = (plotConfig, data, isDataPivoted) => {
  return isDataPivoted
    ? getPivotedFunnelSpecificData(plotConfig, data)
    : getNonPivotedFunnelSpecificData(plotConfig, data);
};

const getWaterfallSpecificData = (plotConfig, data) => {
  const xAxisDataKey = getXAxisDataKey(plotConfig);

  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const activeIds = getSeriesActiveIds(plotConfig);

  const startDataPoint = data.find((d) => d.id === 'start');
  const endDataPoint = data.find((d) => d.id === 'end');

  if (!startDataPoint || !endDataPoint) return [];

  // If activeIds isnt passed, we assume all are active
  const activeData = activeIds ? data.filter((d) => activeIds.includes(d.id)) : data;

  // We don't include the start and end bar in this loop
  // So we must precompute this assuming we've already checked the start bar
  const startDataPointValueChange =
    startDataPoint[yAxisDataKey][1] - startDataPoint[yAxisDataKey][0];

  let baseValueAccumulator = startDataPointValueChange;
  const accumulatedData = activeData.map((d) => {
    const valueChange = d[yAxisDataKey][1] - d[yAxisDataKey][0];
    const newYAxisValue = [baseValueAccumulator, valueChange + baseValueAccumulator];
    baseValueAccumulator += valueChange;
    return { ...d, [yAxisDataKey]: newYAxisValue };
  });

  const otherFactorsDataPoint = {
    id: 'other_factors',
    [xAxisDataKey]: 'Other Factors',
    [yAxisDataKey]: [baseValueAccumulator, endDataPoint[yAxisDataKey][1]],
  };

  return [startDataPoint, ...accumulatedData, otherFactorsDataPoint, endDataPoint];
};

export const getBarSpecificData = (plotConfig, data) => {
  const activeIds = getSeriesActiveIds(plotConfig);

  let processedData = activeIds ? data.filter((d) => activeIds.includes(d.id)) : data;

  // Give each bar a unique id if it doesnt have one
  processedData = processedData.map((d) => {
    return { ...d, id: d ?? d[getXAxisDataKey(plotConfig)] };
  });

  const xAxisDataKey = getXAxisDataKey(plotConfig);

  const getParsedNumber = (value) => Number.parseInt(value, 10);

  const getIsNumeric = (value) => !Number.isNaN(getParsedNumber(value));

  const getIsDatumNumeric = (datum) => getIsNumeric(datum[xAxisDataKey]);

  const isNumericallySortable = data.every(getIsDatumNumeric);

  const sortByNumber = (firstDatum, secondDatum) => {
    const firstDatumNumeric = getParsedNumber(firstDatum[xAxisDataKey]);
    const secondDatumNumeric = getParsedNumber(secondDatum[xAxisDataKey]);
    return firstDatumNumeric < secondDatumNumeric ? -1 : 1;
  };

  if (isNumericallySortable) {
    processedData = processedData.sort(sortByNumber);
  }

  return processedData;
};

export const getHorizontalBarSpecificData = (plotConfig, data) => {
  const activeIds = getSeriesActiveIds(plotConfig);

  let processedData = activeIds ? data.filter((d) => activeIds.includes(d.id)) : data;

  const yAxisDataKey = getYAxisDataKey(plotConfig);

  // Give each bar a unique id if it doesnt have one
  processedData = processedData.map((d) => {
    return { ...d, id: d ?? d[yAxisDataKey] };
  });

  const getParsedNumber = (value) => Number.parseInt(value, 10);

  const getIsNumeric = (value) => !Number.isNaN(getParsedNumber(value));

  const getIsDatumNumeric = (datum) => getIsNumeric(datum[yAxisDataKey]);

  const isNumericallySortable = data.every(getIsDatumNumeric);

  const sortByNumber = (firstDatum, secondDatum) => {
    const firstDatumNumeric = getParsedNumber(firstDatum[yAxisDataKey]);
    const secondDatumNumeric = getParsedNumber(secondDatum[yAxisDataKey]);
    return firstDatumNumeric < secondDatumNumeric ? -1 : 1;
  };

  if (isNumericallySortable) {
    processedData = processedData.sort(sortByNumber);
  }

  return processedData;
};

const getRadialSpecificData = (plotConfig, data) => {
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  // We draw the smallest pieces first. This prevents a visual bug
  // where sometimes small pieces could intersect bigger pieces.
  const formattedData = [...data].sort((firstDatum, secondDatum) => {
    const firstValue = firstDatum[yAxisDataKey];
    const secondValue = secondDatum[yAxisDataKey];
    return firstValue < secondValue ? -1 : 1;
  });
  return formattedData;
};

export const getData = (plotConfig) => {
  const data = getRawData(plotConfig);
  const isDataPivoted = getIsDataPivoted(plotConfig);
  switch (getSeriesType(plotConfig)) {
    case PLOT_TYPES.BAR:
      return getBarSpecificData(plotConfig, data);
    case PLOT_TYPES.HORIZONTAL_BAR:
      return getHorizontalBarSpecificData(plotConfig, data);
    case PLOT_TYPES.FUNNEL_BAR:
      return getFunnelSpecificData(plotConfig, data, isDataPivoted);
    case PLOT_TYPES.GROUPED_BAR:
      return getGroupedBarSpecificData(plotConfig, data, isDataPivoted);
    case PLOT_TYPES.MULTI_LINE:
      return getMultilineSpecificData(plotConfig, data, isDataPivoted);
    case PLOT_TYPES.WATERFALL:
      return getWaterfallSpecificData(plotConfig, data, isDataPivoted);
    case PLOT_TYPES.DONUT:
    case PLOT_TYPES.PIE:
      return getRadialSpecificData(plotConfig, data, isDataPivoted);
    default:
      return isDataPivoted ? getPivotedData(plotConfig, data) : data;
  }
};

export const getValuesOfCategoryAxis = (plotConfig) => {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const uniqueValuesOfDataKey = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  return uniqueValuesOfDataKey.map((value) => {
    return { dataKey: value };
  });
};

export const getHeight = (plotConfig) => {
  return 300;
};
export const getWidth = (plotConfig) => {
  return 300;
};
export const getMargin = (plotConfig = {}) => {
  const { margin = DEFAULT_PLOT_MARGIN } = plotConfig;
  return margin;
};

export const getDoesSeriesHaveFillColor = (plotConfig) => {
  const series = getSeries(plotConfig);
  return series.fillColor !== undefined;
};

export const getDoesSeriesHaveStrokeColor = (plotConfig) => {
  const series = getSeries(plotConfig);
  return series.strokeColor !== undefined;
};

// Series Getters
export const getSeriesFillColor = (plotConfig) => {
  const defaultColor = colors.gray[50];
  const series = getSeries(plotConfig);
  const { fillColor = defaultColor } = series || {};
  return fillColor;
};

export const getSeriesStrokeColor = (plotConfig) => {
  const defaultColor = colors.gray[100];
  const series = getSeries(plotConfig);
  const { strokeColor = defaultColor } = series || {};
  return strokeColor;
};

export const getIsSeriesStacked = (plotConfig) => {
  const series = getSeries(plotConfig);
  const { isStacked = false } = series || {};
  return isStacked;
};

const getPlotOptions = (plotConfig) => {
  return plotConfig.plotOptions ?? {};
};

const getAreaPlotOptions = (plotConfig) => {
  return getPlotOptions(plotConfig).area ?? {};
};

const getGroupedBarPlotOptions = (plotConfig) => {
  return getPlotOptions(plotConfig).grouped_bar ?? {};
};

export const getGroupedBarPlotDisplayType = (plotConfig) => {
  const groupedBarPlotOptions = getGroupedBarPlotOptions(plotConfig);
  return groupedBarPlotOptions?.displayType ?? GROUPED_BAR_DISPLAY_TYPES.GROUPED;
};

export const getAreaPlotDataChangeType = (plotConfig) => {
  const areaPlotOptions = getAreaPlotOptions(plotConfig);
  return areaPlotOptions?.dataChangeType ?? DATA_CHANGE_TYPES.ABSOLUTE;
};

export const getAreaPlotDataAnnotationsChangeType = (plotConfig) => {
  const areaPlotOptions = getAreaPlotOptions(plotConfig);
  return areaPlotOptions?.dataAnnotationsChangeType ?? DATA_CHANGE_TYPES.ABSOLUTE;
};

const getStatPlotOptions = (plotConfig) => {
  return getPlotOptions(plotConfig)[PLOT_TYPES.STAT];
};

export const getStatPlotShowHighContrastDataChangeDirectionColor = (plotConfig) => {
  const statPlotOptions = getStatPlotOptions(plotConfig);
  return statPlotOptions?.showHighContrastDataChangeDirectionColor ?? false;
};

export const getStatPlotTextSize = (plotConfig) => {
  const statPlotOptions = getStatPlotOptions(plotConfig);
  return statPlotOptions?.textSize ?? TEXT_SIZE_TYPES.DYNAMIC;
};

const getRadialPlotOptions = (plotConfig) => {
  return getPlotOptions(plotConfig).radial;
};

export const getRadialPlotDisplayType = (plotConfig) => {
  const radialPlotOptions = getRadialPlotOptions(plotConfig);
  return radialPlotOptions?.displayType ?? RADIAL_PLOT_DISPLAY_TYPES.EXPANDED;
};

export const sortBySeriesName = (firstSeries, secondSeries) =>
  firstSeries.name < secondSeries.name ? -1 : 1;

export const getYAxisPlotOptions = (plotConfig) => {
  const yAxisPlotOptions = getPlotOptions(plotConfig).yAxis;
  return yAxisPlotOptions;
};

export const DEFAULT_Y_AXIS_RANGE = {
  MIN_VALUE: 0,
  MAX_VALUE: 'auto',
};

const convertYAxisRangeToDomain = (range) => [
  range?.minValue ?? DEFAULT_Y_AXIS_RANGE.MIN_VALUE,
  range?.maxValue ?? DEFAULT_Y_AXIS_RANGE.MAX_VALUE,
];

export const getYAxisDomainWithFallback = (plotConfig) => {
  const yAxisPlotOptions = getYAxisPlotOptions(plotConfig);
  const domain = convertYAxisRangeToDomain(yAxisPlotOptions?.range);
  return domain;
};

export const getSecondYAxisPlotOptions = (plotConfig) => {
  const secondYAxisPlotOptions = getPlotOptions(plotConfig).secondYAxis;
  return secondYAxisPlotOptions;
};

export const getSecondYAxisDomainWithFallback = (plotConfig) => {
  const secondYAxisPlotOptions = getSecondYAxisPlotOptions(plotConfig);
  const domain = convertYAxisRangeToDomain(secondYAxisPlotOptions?.range);
  return domain;
};

export const getTooltipLabelDataKey = (plotConfig) => {
  const seriesType = getSeriesType(plotConfig);
  if (seriesType === PLOT_TYPES.HORIZONTAL_BAR) {
    return getYAxisDataKey(plotConfig);
  }
  return getXAxisDataKey(plotConfig);
};
