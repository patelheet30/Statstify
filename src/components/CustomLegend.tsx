import React from 'react';
import { LegendProps } from 'recharts';

const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
  return (
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, color: 'white', display: 'flex', justifyContent: 'center' }}>
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          {entry.type === 'line' ? (
            <div style={{ width: 20, height: 2, backgroundColor: entry.color, marginRight: 5 }}></div>
          ) : (
            <div style={{ width: 10, height: 10, backgroundColor: entry.color, marginRight: 5 }}></div>
          )}
          <span style={{ color: 'white' }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;