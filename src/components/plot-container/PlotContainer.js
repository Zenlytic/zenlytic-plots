/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { ResponsiveContainer } from 'recharts';

const PlotContainer = React.forwardRef(({ children }, ref) => {
  return (
    <div style={{ userSelect: 'none', width: '100%', height: '100%' }} ref={ref}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
});

PlotContainer.propTypes = {};

export default PlotContainer;
