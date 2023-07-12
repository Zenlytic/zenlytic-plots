const OFFSET = 6;

export const getOffsetX = ({ x }) => {
  const parsedX = Number.parseInt(x);
  if (Number.isNaN(parsedX)) {
    return x;
  }

  const offsetX = parsedX - OFFSET;
  return offsetX;
};
