import React from 'react';

function ActiveDot(props) {
  return <circle {...props} strokeWidth={2} fill={props.color} stroke="white" r="4" />;
}

export default ActiveDot;
