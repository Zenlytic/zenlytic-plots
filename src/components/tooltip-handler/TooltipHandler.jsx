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
    isHidden,
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
  if (!active || isHidden) return false;
  if (customPayload && Array.isArray(customPayload) && !customPayload.length) return false;
  return <CustomHoverTooltip {...props} payload={customPayload || payload} />;
}

export default TooltipHandler;
