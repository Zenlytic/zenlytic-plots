import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

function TooltipHandler(props) {
  const {
    isClickTooltipVisible,
    CustomHoverTooltip,
    CustomClickTooltip,
    active,
    closeClickTooltip = () => {},
  } = props;

  const handleOutsideClick = () => {
    closeClickTooltip();
  };

  if (isClickTooltipVisible) {
    return (
      <OutsideClickHandler onOutsideClick={handleOutsideClick}>
        <CustomClickTooltip {...props} />
      </OutsideClickHandler>
    );
  }
  if (!active) return false;
  return <CustomHoverTooltip {...props} />;
}

export default TooltipHandler;
