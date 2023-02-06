import React from 'react';

export const LegendIcon = ({ color, type = 'line' }) => {
  if (type === 'line') {
    return (
      <svg
        className="recharts-surface"
        width="12"
        height="12"
        viewBox="0 0 32 32"
        version="1.1"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <path
          strokeWidth="4"
          fill="none"
          stroke={color}
          d="M0,16h10.666666666666666
                  A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
                  H32M21.333333333333332,16
                  A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
          className="recharts-legend-icon"></path>
      </svg>
    );
  } else if (type === 'square') {
    return (
      <span
        style={{ display: 'inline-block', height: '10px', width: '10px', backgroundColor: color }}
      />
    );
  }
};
