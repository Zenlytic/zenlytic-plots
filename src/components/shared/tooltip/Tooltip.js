/* eslint-disable react/jsx-filename-extension */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip as RechartsTooltip } from 'recharts';
import TooltipHandler from '../../tooltip-handler/TooltipHandler';
import formatValue from '../../../utils/formatValue';
import getD3DataFormatter from '../../../utils/getD3DataFormatter';
import { getFormatter, getTickFormatterFromDataKey } from '../../../utils/plotConfigGetters';
import OutsideClickHandler from 'react-outside-click-handler';
import { HIGHLIGHT_BAR_COLOR } from '../../../constants/plotConstants';

// eslint-disable-next-line react/prop-types

// The tooltip payload can have a nested array in it
const getPayloadFromTooltip = (tooltipPayload, clickedItemId, hoveredItemId) => {
  if (clickedItemId) {
    return tooltipPayload?.filter((payloadItem) => payloadItem?.payload?.id === clickedItemId);
  }
  if (hoveredItemId) {
    return tooltipPayload?.filter((payloadItem) => payloadItem?.payload?.id === hoveredItemId);
  }

  // if (Array.isArray(tooltipPayload?.payload)) {
  //   return tooltipPayload.payload.filter((payloadItem) => payloadItem?.id === hoveredItemId);
  // }
  return tooltipPayload;
};

function TooltipContentWithOutsideClickHandler(props) {
  const {
    onOutsideClick = () => {},
    TooltipContent = false,
    useOutsideClickHandler = true,
    clickedItemId,
    hoveredItemId,
    payload,
    isFollowUpMenuOpen,
  } = props;

  const [newPayload, setNewPayload] = useState(
    getPayloadFromTooltip(payload, clickedItemId, hoveredItemId)
  );

  useEffect(() => {
    if (isFollowUpMenuOpen) {
      return;
    }
    setNewPayload(getPayloadFromTooltip(payload, clickedItemId, hoveredItemId));
  }, [payload, clickedItemId, hoveredItemId, isFollowUpMenuOpen]);

  if (useOutsideClickHandler) {
    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        {React.cloneElement(TooltipContent, { ...props, payload: newPayload })}
      </OutsideClickHandler>
    );
  }
  return React.cloneElement(TooltipContent, { ...props, payload: newPayload });
}

function Tooltip({
  xAxisConfig = {},
  yAxisConfig = {},
  zAxisConfig = {},
  categoryAxisConfig = {},
  TooltipContent = () => {},
  tooltipHandlers = {},
  tooltip = {},
  plotConfig = {},
  customLabelFormatter = null,
  customValueFormatter = null,
  brush = {},
  brushEvents = {},
  isFollowUpDisabled = false,
}) {
  const { tickFormatter: xAxisTickFormatter } = xAxisConfig;
  const { tickFormatter: yAxisTickFormatter } = yAxisConfig;
  const { dataKey: categoryAxisDataKey } = categoryAxisConfig;
  const { dataKey: xAxisDataKey } = xAxisConfig || {};
  const {
    tooltipCoords,
    isFollowUpMenuOpen,
    hoveredItemId,
    clickedItemId,
    useOutsideClickHandler,
  } = tooltip || {};

  const { updateBrush = () => {}, resetBrush = () => {} } = brushEvents || {};
  const { isBrushing = false } = brush;
  const {
    updateIsFollowUpMenuOpen = () => {},
    updateClickedItemId = () => {},
    updateHoveredItemId = () => {},
  } = tooltipHandlers || {};

  const labelFormatter = useCallback(
    (value, payload) => {
      if (customLabelFormatter) {
        return customLabelFormatter(value, payload);
      }
      const formatter = getTickFormatterFromDataKey(plotConfig, xAxisDataKey);
      return formatter(value);
    },
    [plotConfig, xAxisDataKey]
  );

  const valueFormatter = useCallback(
    (value, dataKey) => {
      if (customValueFormatter) {
        return customValueFormatter(value, dataKey);
      }
      const formatter = getTickFormatterFromDataKey(plotConfig, dataKey);
      return formatter(value);
    },
    [plotConfig]
  );

  const isFollowUpMenuOpenAndEnabled = isFollowUpMenuOpen && !isFollowUpDisabled;

  return (
    <RechartsTooltip
      wrapperStyle={
        isFollowUpMenuOpenAndEnabled ? { visibility: 'visible', zIndex: 10000 } : { zIndex: 10000 }
      }
      position={isFollowUpMenuOpenAndEnabled ? tooltipCoords : undefined}
      cursor={isFollowUpMenuOpenAndEnabled ? false : { fill: HIGHLIGHT_BAR_COLOR }}
      formatter={valueFormatter}
      labelFormatter={labelFormatter}
      content={
        <TooltipContentWithOutsideClickHandler
          clickedItemId={clickedItemId}
          hoveredItemId={hoveredItemId}
          categoryAxisDataKey={categoryAxisDataKey}
          isFollowUpMenuOpen={isFollowUpMenuOpenAndEnabled}
          onOutsideClick={() => {
            if (isBrushing) {
              return;
            }
            updateIsFollowUpMenuOpen(false);
            resetBrush();
            updateClickedItemId(null);
          }}
          TooltipContent={TooltipContent}
        />
      }
    />
  );
}

Tooltip.propTypes = {};

export default Tooltip;
