// src/utils/mockChartData.js

/**
 * Generate unique candle data for each token
 * @param {number} basePrice - Starting price
 * @param {string} symbol - Token symbol (for unique pattern)
 * @param {number} count - Number of candles
 * @returns {Array} Candle data array
 */
export const generateCandleData = (basePrice = 100, symbol = 'TOKEN', count = 100) => {
  const data = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000) - count * 60;
  
  // ✅ Symbol ke hisaab se seed generate karo (consistent pattern)
  let seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // ✅ Har token ki alag trend (based on symbol)
  const trend = ((seed % 100) - 50) / 500;
  
  // ✅ Har token ki alag volatility
  const volatility = 0.02 + (seed % 7) * 0.005;

  for (let i = 0; i < count; i++) {
    const change = (seededRandom() - 0.5) * volatility * currentPrice + trend * currentPrice;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + seededRandom() * 2;
    const low = Math.min(open, close) - seededRandom() * 2;
    
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

/**
 * Format real candle data from backend
 * @param {Array} priceHistory - Price history array from API
 * @returns {Array} Formatted candle data
 */
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