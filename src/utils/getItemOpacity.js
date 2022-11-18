const getItemOpacity = ({ id, hoveredItemId, clickedItemId }) => {
  if (!hoveredItemId && !clickedItemId) {
    return 1;
  }
  if (clickedItemId === id) {
    return 1;
  }
  if (clickedItemId) {
    return 0.2;
  }
  if (hoveredItemId === id) {
    return 1;
  }
  return 0.2;
};
export default getItemOpacity;
