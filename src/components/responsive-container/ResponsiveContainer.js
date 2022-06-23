import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer as RechartsResponsiveContainer } from 'recharts';

function ResponsiveContainer({ children, width = '100%', height = '100%' }) {
  return (
    <RechartsResponsiveContainer width={width} height={height}>
      {children}
    </RechartsResponsiveContainer>
  );
}

ResponsiveContainer.propTypes = {};

export default ResponsiveContainer;
