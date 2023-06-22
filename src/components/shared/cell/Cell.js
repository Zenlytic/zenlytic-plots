import React from 'react';
import { Cell as RechartsCell } from 'recharts';

export default function Cell({ key, fill, strokeWidth }) {
  return <RechartsCell key={key} fill={fill} strokeWidth={strokeWidth} />;
}
