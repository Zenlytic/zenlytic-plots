import React from 'react';
import Dot from './Dot';

function ActiveDot({ color, ...rest }) {
  return Dot({ ...rest, color, strokeWidth: 2, radius: '4' });
}

export default ActiveDot;
