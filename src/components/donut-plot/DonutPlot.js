/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import PiePlot from '../pie-plot/PiePlot';

function DonutPlot({ plotConfig = {}, TooltipContent = false, isFollowUpDisabled = false }) {
  return (
    <PiePlot
      plotConfig={plotConfig}
      TooltipContent={TooltipContent}
      isFollowUpDisabled={isFollowUpDisabled}
      useDonutSlices
    />
  );
}

export default DonutPlot;
