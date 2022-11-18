import React from 'react';
import PropTypes from 'prop-types';
import { ReferenceArea } from 'recharts';
import { BRUSH_BORDER_COLOR, BRUSH_COLOR } from '../../../constants/plotConstants';

const Brush = ({ x1, x2, y1 = undefined, y2 = undefined }) => {
  return (
    <ReferenceArea
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      isFront
      fill={BRUSH_COLOR}
      stroke={BRUSH_BORDER_COLOR}
      alwaysShow
    />
  );
};

Brush.propTypes = {};

export default Brush;
