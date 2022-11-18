export default (plotConfig) => {
  const { series = [] } = plotConfig;
  if (!series.length) {
    return null;
  }
  if (series.length > 1) {
    // TODO: Dont currently have multi series
    return 'multi';
  }
  const { type } = series[0];
  return type;
};
