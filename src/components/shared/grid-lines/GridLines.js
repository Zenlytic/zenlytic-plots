import React from 'react';
import { CartesianGrid } from 'recharts';
import { DEFAULT_CARTESIAN_GRID_COLOR } from '../../../constants/plotConstants';

const GridLines = (props) => {
  return <CartesianGrid stroke={DEFAULT_CARTESIAN_GRID_COLOR} />;
};

GridLines.propTypes = {};

export default GridLines;
