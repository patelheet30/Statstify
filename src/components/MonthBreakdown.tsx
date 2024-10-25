import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from '@/components/charts/CustomTooltip';
import CustomLegend from '@/components/charts/CustomLegend';

interface PlayEvent {
  date: string;
  msPlayed: number;
}

interface MonthBreakdownProps {
  whenPlayed: PlayEvent[];
  timeScale: string;
}

const MonthBreakdown: React.FC<MonthBreakdownProps> = ({ whenPlayed, timeScale }) => {
  const processData = (data: PlayEvent[], scale: string) => {
    const groupedData: { [key: string]: { msPlayed: number; count: number } } = {};

    data.forEach(playEvent => {
      const date = new Date(playEvent.date);
      let key = '';

      if (scale === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (scale === 'weekly') {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
        key = startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (scale === 'monthly') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
      } else if (scale === 'yearly') {
        key = `${date.getFullYear()}`; // YYYY
      }

      if (!groupedData[key]) {
        groupedData[key] = { msPlayed: 0, count: 0 };
      }
      groupedData[key].msPlayed += playEvent.msPlayed;
      groupedData[key].count += 1;
    });

    return Object.entries(groupedData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, { msPlayed, count }]) => ({
        date,
        minutesPlayed: Math.floor(msPlayed / 60000),
        timesPlayed: count,
      }));
  };

  const filteredData = processData(whenPlayed, timeScale);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={filteredData}>
        <XAxis dataKey="date" stroke="white"/>
        <YAxis yAxisId="left" orientation="left" stroke="white" />
        <YAxis yAxisId="right" orientation="right" stroke="white" />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />}/>
        <Bar yAxisId="left" dataKey="timesPlayed" barSize={20} fill="rgba(30, 215, 96, 0.3)" radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="minutesPlayed" stroke="#1ED760" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MonthBreakdown;