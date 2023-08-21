/* eslint-disable import/prefer-default-export */
export const getRatioSafe = (value, total) => {
  if (total === 0) {
    return 0;
  }
  return value / total;
};

export const getAbsoluteNumber = (rawValue) => {
  if (Number.isNaN(rawValue)) {
    return 0;
  }

  const absoluteValue = Math.abs(rawValue);

  if (Number.isNaN(absoluteValue)) {
    return 0;
  }

  return absoluteValue;
};
