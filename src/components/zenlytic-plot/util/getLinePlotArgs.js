export const getLinePlotArgs = (plotData) => {
  const { xAxis = {}, yAxis = {}, categoryAxis = {}, lines = {}, plotColor = '#8a8a8a' } = plotData;
  const {
    format: yAxisZenlyticFormat,
    dataKey: yAxisDataIndex,
    label: yAxisLabel,
    showLabel: showYAxisLabel,
  } = yAxis;

  const {
    dataKey: xAxisDataIndex,
    format: xAxisZenlyticFormat,
    label: xAxisLabel,
    showLabel: showXAxisLabel,
    columnId: xAxisColumnId,
  } = xAxis;

  return {
    xAxisDataIndex,
    xAxisZenlyticFormat,
    yAxisZenlyticFormat,
    yAxisDataIndex,
    plotColor,
    backgroundColor: 'white',
    showLabels: true,
    showPatternLines: true,
    showGridColumns: true,
    xAxisLabel,
    showXAxisLabel,
    yAxisLabel,
    showYAxisLabel: true,
    colorScale: null,
    categoryKeys: [],
    selectedKeys: [],
    width: 1152,
    height: 384,
    lines,
  };
};
export default getLinePlotArgs;
