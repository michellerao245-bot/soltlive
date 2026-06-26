// src/components/Sparkline.jsx
import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  return (
    <Sparklines data={data} width={80} height={30}>
      <SparklinesLine color={color || '#22c55e'} style={{ strokeWidth: 2 }} />
    </Sparklines>
  );
};

export default React.memo(Sparkline);