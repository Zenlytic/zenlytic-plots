import { useState } from 'react';

export const BRUSH_SELECTION_TYPES = {
  RANGE: 'range',
  ITEMS: 'items',
  RANGE_AND_ITEMS: 'rangeAndItems',
};

export const BRUSH_DIRECTIONS = {
  BOTH: 'both',
  HORIZONTAL: 'horizontal',
};

const defaultInitialState = {
  x1: null,
  x2: null,
  y1: null,
  y2: null,
  isBrushing: false,
  xDataKey: null,
  yDataKey: null,
};

function useBrush(params) {
  const {
    initialState = defaultInitialState,
    brushType = 'category',
    brushDirection = 'horizontal',
    onBrushUpdate = () => {},
    tooltipHandlers = {},
    tooltip = {},
    xAxisDataKey,
    xAxisFormat,
    yAxisDataKey,
    brushSelectionType = BRUSH_SELECTION_TYPES.RANGE, // brushSelectionType is used to what it is we are trying to select
    yAxisFormat,
  } = params || {};

  const { updateTooltipCoords = () => {}, updateIsFollowUpMenuOpen = () => {} } = tooltipHandlers;
  const { isFollowUpMenuOpen = false } = tooltip;

  const [state, setState] = useState(initialState);

  const getHorizontalEventValue = (e) => {
    if (brushType === 'number') {
      return e?.activeCoordinate?.x;
    }
    return e?.activeLabel;
  };

  const updateBrush = (brush) => {
    const { x1, x2, y1, y2, isBrushing } = brush;
    setState((currentState) => {
      return { ...currentState, x1, x2, y1, y2, isBrushing };
    });
  };

  const updateIsBrushing = (newIsBrushing) => {
    setState((currentState) => ({ ...currentState, isBrushing: newIsBrushing }));
  };

  const resetBrush = () => {
    setState(initialState);
  };

  const onMouseDown = (e) => {
    console.log(e, 'useBrush.onMouseDown');
    if (isFollowUpMenuOpen) return; // If the follow up menu is open, don't allow the brush to start
    if (brushDirection === BRUSH_DIRECTIONS.BOTH) {
      setState((currentState) => ({
        ...currentState,
        x1: e?.xValue,
        x2: e?.xValue,
        y1: e?.yValue,
        y2: e?.yValue,
        isBrushing: true,
      }));
      return;
    }
    // Set both brush ends to the same value where the user clicked
    setState((currentState) => ({
      ...currentState,
      x1: getHorizontalEventValue(e),
      x2: getHorizontalEventValue(e),
      isBrushing: true,
    }));
  };

  const onMouseMove = (e) => {
    if (isFollowUpMenuOpen) return; // If the follow up menu is open, don't allow the brush to start
    if (!state.isBrushing) return; // User is not brushing, so don't update the brush
    if (!state.x1 || (brushDirection === BRUSH_DIRECTIONS.BOTH && !state.y1)) return; // User moved their brushing cursor outside of the chart, so don't update the brush

    if (brushDirection === BRUSH_DIRECTIONS.BOTH && e?.xValue && e?.yValue) {
      setState((currentState) => ({
        ...currentState,
        x1: state.x1,
        x2: e?.xValue,
        y1: state.y1,
        y2: e?.yValue,
        isBrushing: true,
      }));

      updateTooltipCoords({ x: e?.chartX, y: e?.chartY });
      return;
    }
    if (getHorizontalEventValue(e)) {
      setState((currentState) => ({
        ...currentState,
        x1: state.x1,
        x2: getHorizontalEventValue(e),
        isBrushing: true,
      }));
      updateTooltipCoords(e?.activeCoordinate);
    }
  };

  const onMouseUp = (e) => {
    console.log('useBrush.onMouseUp', e, state, isFollowUpMenuOpen)
    if (!state.isBrushing) return; // User is not brushing, so don't update the brush
    if (isFollowUpMenuOpen) return; // If the follow up menu is open, don't update the brush
    updateIsBrushing(false); // User is done brushing, so set isBrushing to false
    updateIsFollowUpMenuOpen(true); // Open the follow up menu
    // The user either clicked or dragged the brush off the plot, so invalidate the brush
    if (state.x2 === null) {
      resetBrush();
      updateIsFollowUpMenuOpen(false);
      updateTooltipCoords(null);
      return;
    }
    
    updateTooltipCoords(e?.activeCoordinate);

    const isXFlipped = state.x1 > state.x2;
    const isYFlipped = state.y1 > state.y2;

    onBrushUpdate({
      x1: isXFlipped ? state.x2 : state.x1,
      x2: isXFlipped ? state.x1 : state.x2,
      y1: isYFlipped ? state.y2 : state.y1,
      y2: isYFlipped ? state.y1 : state.y2,
      xAxisDataKey,
      xAxisFormat,
      yAxisDataKey,
      yAxisFormat,
      brushSelectionType,
    });
  };

  return [
    state,
    {
      updateBrush,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      resetBrush,
    },
  ];
}

export default useBrush;
