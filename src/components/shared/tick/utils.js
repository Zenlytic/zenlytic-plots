const X_OFFSET = 6;

export const getOffsetX = ({ x, orientation }) => {
  const parsedX = Number.parseInt(x);
  if (Number.isNaN(parsedX)) {
    return x;
  }

  const offsetX = orientation === 'right' ? parsedX + X_OFFSET : parsedX - X_OFFSET;
  return offsetX;
};

const Y_OFFSET = 6;

export const getOffsetY = ({ y }) => {
  const parsedY = Number.parseInt(y);
  if (Number.isNaN(parsedY)) {
    return y;
  }
  const offsetY = parsedY + Y_OFFSET;
  return offsetY;
};
