/* eslint-disable import/prefer-default-export */
export const getRatioSafe = (value, total) => {
  if (total === 0) {
    return 0;
  }
  return value / total;
};
