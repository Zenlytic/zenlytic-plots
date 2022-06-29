import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

function TooltipHandler(props) {
  const {
    isClickTooltipVisible,
    CustomHoverTooltip = undefined,
    CustomClickTooltip = undefined,
    active,
    closeClickTooltip = () => {},
    customPayload = undefined,
    payload,
  } = props;

  const handleOutsideClick = () => {
    closeClickTooltip();
  };

  if (isClickTooltipVisible) {
    return (
      <OutsideClickHandler onOutsideClick={handleOutsideClick}>
        <CustomClickTooltip {...props} payload={customPayload || payload} />
      </OutsideClickHandler>
    );
  }
  if (!active) return false;
  return <CustomHoverTooltip {...props} />;
}

export default TooltipHandler;
