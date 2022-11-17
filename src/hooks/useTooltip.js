import { useState } from 'react';

function useTooltip(params) {
  const {
    initialState = {
      tooltipCoords: null,
      isFollowUpMenuOpen: false,
      hoveredItemId: null,
      clickedItemId: null,
      useOutsideClickHandler: true,
    },
  } = params || {};
  const [state, setState] = useState(initialState);

  const updateHoveredItemId = (hoveredItemId) => {
    setState((currentState) => {
      return { ...currentState, hoveredItemId };
    });
  };

  const updateTooltipCoords = (tooltipCoords) => {
    setState((currentState) => {
      return { ...currentState, tooltipCoords };
    });
  };

  const updateIsFollowUpMenuOpen = (isOpen) => {
    setState((currentState) => {
      return { ...currentState, isFollowUpMenuOpen: isOpen };
    });
  };

  const updateClickedItemId = (clickedItemId, tooltipCoords) => {
    if (!clickedItemId) {
      setState((currentState) => {
        return { ...currentState, clickedItemId, isFollowUpMenuOpen: false, tooltipCoords };
      });
      return;
    }
    setState((currentState) => {
      return { ...currentState, clickedItemId, isFollowUpMenuOpen: true, tooltipCoords };
    });
  };

  return [
    state,
    { updateTooltipCoords, updateIsFollowUpMenuOpen, updateHoveredItemId, updateClickedItemId },
  ];
}

export default useTooltip;
