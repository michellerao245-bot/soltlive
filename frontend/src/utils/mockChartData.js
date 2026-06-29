// src/utils/mockChartData.js
export const generateCandleData = (basePrice = 100, count = 100) => {
  const data = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000) - count * 60;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * 4;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.push({
      time: now + i * 60,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });
    
    currentPrice = close;
  }

  return data;
};

// Real candle data from backend (if available)
export const formatCandleData = (priceHistory) => {
  if (!priceHistory || priceHistory.length === 0) return [];
  
  return priceHistory.map(item => ({
    time: Math.floor(new Date(item.timestamp).getTime() / 1000),
    open: item.open || item.price * 0.99,
    high: item.high || item.price * 1.01,
    low: item.low || item.price * 0.98,
    close: item.close || item.price,
  }));
};