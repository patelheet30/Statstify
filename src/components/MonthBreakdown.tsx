import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './Charts/CustomTooltip';
import CustomLegend from './Charts/CustomLegend';

interface PlayEvent {
  date: string;
  msPlayed: number;
}

interface MonthBreakdownProps {
  whenPlayed: PlayEvent[];
}

const MonthBreakdown: React.FC<MonthBreakdownProps> = ({ whenPlayed }) => {
  const monthData = whenPlayed.reduce((acc, playEvent) => {
    const date = new Date(playEvent.date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = { msPlayed: 0, count: 0 };
    acc[month].msPlayed += playEvent.msPlayed;
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, { msPlayed: number; count: number }>);

  const sortedMonthData = Object.entries(monthData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, { msPlayed, count }]) => ({
      month,
      minutesPlayed: Math.floor(msPlayed / 60000),
      timesPlayed: count,
    }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={sortedMonthData}>
        <XAxis dataKey="month" stroke="white"/>
        <YAxis yAxisId="left" orientation="left" stroke="white" />
        <YAxis yAxisId="right" orientation="right" stroke="white" />
        <Tooltip content={<CustomTooltip />} />
        <Legend  content={<CustomLegend />}/>
        <Bar yAxisId="left" dataKey="timesPlayed" barSize={20} fill="rgba(30, 215, 96, 0.3)" radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="minutesPlayed" stroke="#1ED760" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MonthBreakdown;