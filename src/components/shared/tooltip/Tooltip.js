/* eslint-disable react/jsx-filename-extension */
import React, { useCallback, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Tooltip as RechartsTooltip } from 'recharts';
import { HIGHLIGHT_BAR_COLOR, PLOT_TYPES } from '../../../constants/plotConstants';
import {
  getSeriesType,
  getTickFormatterFromDataKey,
  getTooltipLabelDataKey,
  getXAxisDataKey,
  getYAxisDataKey,
} from '../../../utils/plotConfigGetters';

// eslint-disable-next-line react/prop-types

// The tooltip payload can have a nested array inside it
const getPayloadFromTooltip = (tooltipPayload, clickedItemId, hoveredItemId) => {
  if (clickedItemId) {
    return tooltipPayload?.filter((payloadItem) => payloadItem?.payload?.id === clickedItemId);
  }
  if (hoveredItemId) {
    return tooltipPayload?.filter((payloadItem) => {
      // TODO: can't tell what is nested and what is not. Need to investigate to do one or the other
      return payloadItem?.id === hoveredItemId || payloadItem?.payload?.id === hoveredItemId;
    });
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
  customNameFormatter = null,
  brush = {},
  brushEvents = {},
  isFollowUpDisabled = false,
}) {
  const { tickFormatter: xAxisTickFormatter } = xAxisConfig;
  const { tickFormatter: yAxisTickFormatter, dataKey: yAxisDataKey } = yAxisConfig;
  const { dataKey: categoryAxisDataKey } = categoryAxisConfig;

  const { dataKey: xAxisDataKey } = xAxisConfig || {};
  const yAxisDataKeyToUse = yAxisDataKey || getYAxisDataKey(plotConfig);
  const xAxisDataKeyToUse = xAxisDataKey || getXAxisDataKey(plotConfig);
  const seriesType = getSeriesType(plotConfig);
  const tooltipYAxisDataKey =
    seriesType === PLOT_TYPES.HORIZONTAL_BAR ? xAxisDataKeyToUse : yAxisDataKeyToUse;

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

  const tooltipLabelDataKey = getTooltipLabelDataKey(plotConfig);

  const labelFormatter = useCallback(
    (value, payload) => {
      if (customLabelFormatter) {
        return customLabelFormatter(value, payload);
      }
      const formatter = getTickFormatterFromDataKey(plotConfig, tooltipLabelDataKey);
      return formatter(value);
    },
    [plotConfig, tooltipLabelDataKey]
  );

  const valueFormatter = useCallback(
    (value, dataKey, payload) => {
      if (customValueFormatter) {
        return customValueFormatter(value, dataKey, payload);
      }
      const formatter = getTickFormatterFromDataKey(plotConfig, dataKey);
      return formatter(value);
    },
    [plotConfig]
  );

  const memoizedCustomNameFormatter = useCallback(
    ({ value, dataKey, payload }) => {
      return customNameFormatter({ value, dataKey, payload });
    },
    [plotConfig]
  );

  const nameFormatter = customNameFormatter ? memoizedCustomNameFormatter : null;

  const isFollowUpMenuOpenAndEnabled = isFollowUpMenuOpen && !isFollowUpDisabled;

  const onCloseFollowUpMenu = () => {
    updateIsFollowUpMenuOpen(false);
    resetBrush();
    updateClickedItemId(null);
  };

  return (
    <RechartsTooltip
      wrapperStyle={
        isFollowUpMenuOpenAndEnabled ? { visibility: 'visible', zIndex: 10000 } : { zIndex: 10000 }
      }
      position={isFollowUpMenuOpenAndEnabled ? tooltipCoords : undefined}
      cursor={isFollowUpMenuOpenAndEnabled ? false : { fill: HIGHLIGHT_BAR_COLOR }}
      formatter={valueFormatter}
      labelFormatter={labelFormatter}
      nameFormatter={nameFormatter}
      allowEscapeViewBox={{ x: true, y: true }}
      content={
        <TooltipContentWithOutsideClickHandler
          clickedItemId={clickedItemId}
          hoveredItemId={hoveredItemId}
          yAxisDataKey={tooltipYAxisDataKey}
          categoryAxisDataKey={categoryAxisDataKey}
          isFollowUpMenuOpen={isFollowUpMenuOpenAndEnabled}
          onCloseFollowUpMenu={onCloseFollowUpMenu}
          onOutsideClick={() => {
            if (isBrushing) {
              return;
            }
            onCloseFollowUpMenu();
          }}
          TooltipContent={TooltipContent}
        />
      }
    />
  );
}

Tooltip.propTypes = {};

export default Tooltip;
