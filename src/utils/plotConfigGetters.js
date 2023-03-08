import { isEmpty, sortBy } from 'lodash';
import colors from '../constants/colors';
import {
  AXIS_DATA_KEY_KEYS,
  dataChangeTypes,
  DEFAULT_PLOT_MARGIN,
  groupedBarDisplayTypes,
  PLOT_TYPES,
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

const getAxisFromDataKey = (plotConfig, axisDataKey) => {
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

export const getIsDataPivoted = (plotConfig) => {
  const categoryAxis = getCategoryAxis(plotConfig);
  return !isEmpty(categoryAxis);
};

export const getXAxis = (plotConfig) => {
  const xAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.X_AXIS_DATA_KEY_KEY);
  const seriesType = getSeriesType(plotConfig);
  if (!xAxis) return {};
  const { dataType, name, dataKey, format } = xAxis || {};
  const isDataPivoted = getIsDataPivoted(plotConfig);
  const tickFormatter = getFormatter(format);
  return {
    type: dataType,
    name,
    dataKey,
    tickFormatter,
    allowDuplicatedCategory: seriesType === PLOT_TYPES.FUNNEL_BAR || !isDataPivoted,
  };
};

export const getXAxisTickFormatter = (plotConfig) => {
  const xAxis = getXAxis(plotConfig);
  return xAxis?.tickFormatter;
};

export const getXAxisDataKey = (plotConfig) => {
  const xAxis = getXAxis(plotConfig);
  return xAxis?.dataKey;
};
export const getXAxisName = (plotConfig) => {
  const xAxis = getXAxis(plotConfig);
  return xAxis?.name;
};

export const getSecondYAxis = (plotConfig) => {
  const secondYAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.SECOND_Y_AXIS_DATA_KEY_KEY);
  if (!secondYAxis) return {};
  const { dataType, name, dataKey, format } = secondYAxis || {};
  const tickFormatter = getFormatter(format);
  return { type: dataType, name, dataKey, tickFormatter, yAxisId: 'right', orientation: 'right' };
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

export const getYAxis = (plotConfig) => {
  const yAxis = getAxisFromAxes(plotConfig, AXIS_DATA_KEY_KEYS.Y_AXIS_DATA_KEY_KEY);
  if (!yAxis) return {};
  const { dataType, name, dataKey, format } = yAxis || {};
  const isSplitAxes = getIsSplitAxes(plotConfig);

  const tickFormatter = getFormatter(format);
  return {
    type: dataType,
    name,
    dataKey,
    tickFormatter,
    yAxisId: isSplitAxes ? 'left' : undefined,
    orientation: isSplitAxes ? 'left' : undefined,
  };
};

export const getYAxisTickFormatter = (plotConfig) => {
  const yAxis = getYAxis(plotConfig);
  return yAxis.tickFormatter;
};

export const getYAxisDataKey = (plotConfig) => {
  const yAxis = getYAxis(plotConfig);
  return yAxis?.dataKey;
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

export const getCategoriesOfCategoryAxis = (plotConfig) => {
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const categories = getUniqueValuesOfDataKey(plotConfig, categoryAxisDataKey);
  return categories.map((category) => {
    return { name: category, dataKey: category };
  });
};

export const getCategoryValueAxes = (plotConfig) => {
  // Used if we should use the categories of a certain axis as the legend items
  if (getCategoryAxisDataKey(plotConfig)) {
    return getCategoriesOfCategoryAxis(plotConfig).sort(sortBySeriesName);
  }
  const categoryValueDataKeys = getSeriesKeyValue(
    plotConfig,
    AXIS_DATA_KEY_KEYS.CATEGORY_VALUE_DATA_KEYS_KEY
  );
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
      calculatedDataPoint.push({
        [xAxisDataKey]: d[xAxisDataKey],
        [`CONVERTED_${seriesName}`]: d[yAxisDataKey],
        [`DROPPED_OFF_${seriesName}`]: index === 0 ? 0 : previousValue - d[yAxisDataKey],
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
    newData.push({
      ...d,
      CONVERTED: d[yAxisDataKey],
      DROPPED_OFF: index === 0 ? 0 : previousValue - d[yAxisDataKey],
    });
    previousValue = d[yAxisDataKey];
  });
  return newData;
};

const getGroupedBarSpecificData = (plotConfig, data, isDataPivoted) => {
  const xAxisDataKey = getXAxisDataKey(plotConfig);
  const yAxisDataKey = getYAxisDataKey(plotConfig);
  const categoryAxisDataKey = getCategoryAxisDataKey(plotConfig);
  const getFormattedData = (data) =>
    data.map((datum) => {
      const builtData = datum.data.reduce((agg, cur) => {
        const categoryAxisValue = cur[categoryAxisDataKey];
        const yAxisValue = cur[yAxisDataKey];
        agg[categoryAxisValue] = yAxisValue;
        return agg;
      }, {});
      return {
        name: datum.name,
        ...builtData,
      };
    });
  const pivotedData = pivotDataByDataKey(plotConfig, data, xAxisDataKey);
  const formattedPivotedData = getFormattedData(pivotedData);
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

const getSubStatDataKey = (plotConfig) => {
  const series = getSeries(plotConfig);
  return series?.subStatDataKey;
};

export const getStatDataKeys = (plotConfig) => {
  const series = getSeries(plotConfig);
  return series?.statDataKeys ?? [];
};

export const getSubStatAxis = (plotConfig) => {
  const axes = getAxes(plotConfig);
  const subStatDataKey = getSubStatDataKey(plotConfig);
  return axes.find((a) => a.dataKey === subStatDataKey);
};

export const getDoesSubStatDataExist = (plotConfig) => {
  const subStatDataKey = getSubStatDataKey(plotConfig);
  return subStatDataKey !== undefined;
};

export const getBarSpecificData = (plotConfig, data) => {
  const activeIds = getSeriesActiveIds(plotConfig);
  const activeData = activeIds ? data.filter((d) => activeIds.includes(d.id)) : data;
  // Give each bar a unique id if it doesnt have one
  return activeData.map((d) => {
    return { ...d, id: d ?? d[getXAxisDataKey(plotConfig)] };
  });
};

export const getData = (plotConfig) => {
  const { data = [] } = plotConfig;
  const isDataPivoted = getIsDataPivoted(plotConfig);
  switch (getSeriesType(plotConfig)) {
    case PLOT_TYPES.BAR:
      return getBarSpecificData(plotConfig, data);
    case PLOT_TYPES.FUNNEL_BAR:
      return getFunnelSpecificData(plotConfig, data, isDataPivoted);
    case PLOT_TYPES.GROUPED_BAR:
      return getGroupedBarSpecificData(plotConfig, data, isDataPivoted);
    case PLOT_TYPES.WATERFALL:
      return getWaterfallSpecificData(plotConfig, data, isDataPivoted);
    default:
      return isDataPivoted ? getPivotedData(plotConfig, data) : data;
  }
};

export const getStatDatumByDataKey = (plotConfig, dataKey) => {
  const data = getData(plotConfig);
  return data.find((datum) => datum[dataKey] !== undefined);
};

export const getSubStatDatumByDataKey = (plotConfig, dataKey) => {
  const datum = getStatDatumByDataKey(plotConfig, dataKey);
  if (datum === undefined) {
    return {};
  }
  const subStatDataKey = getSubStatDataKey(plotConfig);
  return datum[subStatDataKey];
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
  return plotConfig.plotOptions;
};

const getAreaPlotOptions = (plotConfig) => {
  return getPlotOptions(plotConfig).area;
};

const getGroupedBarPlotOptions = (plotConfig) => {
  return getPlotOptions(plotConfig).grouped_bar;
};

export const getGroupedBarPlotDisplayType = (plotConfig) => {
  const groupedBarPlotOptions = getGroupedBarPlotOptions(plotConfig);
  return groupedBarPlotOptions?.displayType ?? groupedBarDisplayTypes.GROUPED;
};

export const getAreaPlotDataChangeType = (plotConfig) => {
  const areaPlotOptions = getAreaPlotOptions(plotConfig);
  return areaPlotOptions?.dataChangeType ?? dataChangeTypes.ABSOLUTE;
};

export const getAreaPlotDataAnnotationsChangeType = (plotConfig) => {
  const areaPlotOptions = getAreaPlotOptions(plotConfig);
  return areaPlotOptions?.dataAnnotationsChangeType ?? dataChangeTypes.ABSOLUTE;
};

export const sortBySeriesName = (firstSeries, secondSeries) =>
  firstSeries.name < secondSeries.name ? -1 : 1;
