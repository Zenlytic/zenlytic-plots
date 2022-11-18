/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { ResponsiveContainer } from 'recharts';

function PlotContainer({ children }) {
  return (
    <div style={{ userSelect: 'none', width: '100%', height: '100%' }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

PlotContainer.propTypes = {};

export default PlotContainer;
