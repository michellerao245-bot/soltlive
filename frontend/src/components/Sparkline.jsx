import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  return (
    <Sparklines data={data} width={70} height={28} margin={2}>
      <SparklinesLine color={color || '#22c55e'} style={{ strokeWidth: 1.5 }} />
    </Sparklines>
  );
};

export default React.memo(Sparkline);