import React from 'react';
import { TooltipProps } from 'recharts';

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'black', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{label}</p>
        <p className="">{`Times Played: ${payload[0].value}`}</p>
        <p className="intro">{`Minutes Played: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;