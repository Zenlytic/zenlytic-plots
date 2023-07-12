import React from 'react';

function Dot(props) {
  return <circle {...props} strokeWidth={1} fill={props.color} stroke="white" r="2" />;
}

export default Dot;
