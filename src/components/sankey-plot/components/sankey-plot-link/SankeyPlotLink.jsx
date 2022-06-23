import React, { useState } from 'react';
import { Rectangle, Layer } from 'recharts';

export default function SankeyPlotLink({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
  colorGradients,
}) {
  const gradientID = `linkGradient${index}`;
  const [fill, setFill] = useState('#8a8a8a50');
  return (
    <Layer key={`CustomLink${index}`}>
      <defs>
        <linearGradient id={gradientID}>
          <stop offset="20%" stopColor={colorGradients[index].source} />
          <stop offset="80%" stopColor={colorGradients[index].target} />
        </linearGradient>
      </defs>
      <path
        d={`
            M${sourceX},${sourceY + linkWidth / 2}
            C${sourceControlX},${sourceY + linkWidth / 2}
              ${targetControlX},${targetY + linkWidth / 2}
              ${targetX},${targetY + linkWidth / 2}
            L${targetX},${targetY - linkWidth / 2}
            C${targetControlX},${targetY - linkWidth / 2}
              ${sourceControlX},${sourceY - linkWidth / 2}
              ${sourceX},${sourceY - linkWidth / 2}
            Z
          `}
        fill={fill}
        strokeWidth="0"
        onMouseEnter={() => {
          setFill(`url(#${gradientID})`);
        }}
        onMouseLeave={() => {
          setFill('#8a8a8a50');
        }}
      />
    </Layer>
  );
}
