// src/utils/mockChartData.js

/**
 * Generate unique candle data for each token and timeframe
 * @param {number} basePrice
 * @param {string} symbol
 * @param {number} count
 * @param {string} timeframe
 * @returns {Array}
 */

export const generateCandleData = (
  basePrice = 100,
  symbol = "TOKEN",
  count = 100,
  timeframe = "1D"
) => {
  const intervals = {
    "10M": 600,
    "15M": 900,
    "30M": 1800,
    "1H": 3600,
    "5H": 18000,
    "12H": 43200,
    "24H": 86400,
    "1W": 604800,
    "1M": 2592000,
    "3M": 7776000,
    "1Y": 31536000,
  };

  const interval = intervals[timeframe] || 86400;

  const data = [];
  let currentPrice = Number(basePrice);

  const now = Math.floor(Date.now() / 1000) - count * interval;

  // Unique seed based on symbol + timeframe
  let seed =
    symbol.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) +
    interval;

  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Trend
  const trend = ((seed % 100) - 50) / 500;

  // Volatility according to timeframe
  const volatilityMap = {
    "10M": 0.008,
    "15M": 0.010,
    "30M": 0.012,
    "1H": 0.015,
    "5H": 0.018,
    "12H": 0.020,
    "24H": 0.025,
    "1W": 0.035,
    "1M": 0.050,
    "3M": 0.070,
    "1Y": 0.090,
  };

  const volatility = volatilityMap[timeframe] || 0.025;

  for (let i = 0; i < count; i++) {
    const change =
      (random() - 0.5) * volatility * currentPrice +
      trend * currentPrice;

    const open = currentPrice;
    const close = open + change;

    const high =
      Math.max(open, close) +
      random() * currentPrice * volatility * 0.5;

    const low =
      Math.min(open, close) -
      random() * currentPrice * volatility * 0.5;

    data.push({
      time: now + i * interval,
      open: Number(open.toFixed(6)),
      high: Number(high.toFixed(6)),
      low: Number(low.toFixed(6)),
      close: Number(close.toFixed(6)),
    });

    currentPrice = close;
  }

  return data;
};

/**
 * Format real candle data from backend
 */

export const formatCandleData = (priceHistory) => {
  if (!priceHistory || priceHistory.length === 0) return [];

  return priceHistory.map((item) => ({
    time: Math.floor(new Date(item.timestamp).getTime() / 1000),
    open: Number(item.open ?? item.price * 0.99),
    high: Number(item.high ?? item.price * 1.01),
    low: Number(item.low ?? item.price * 0.98),
    close: Number(item.close ?? item.price),
  }));
};