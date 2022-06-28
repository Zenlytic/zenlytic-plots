import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

function TooltipHandler(props) {
  const {
    isClickTooltipVisible,
    CustomHoverTooltip,
    CustomClickTooltip,
    active,
    closeClickTooltip = () => {},
    customPayload = undefined,
    payload,
  } = props;
  console.log('🚀 ~ file: TooltipHandler.jsx ~ line 12 ~ TooltipHandler ~ props', props);

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
