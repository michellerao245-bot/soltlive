// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from 'react';

const CandleChart = ({ data, height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadChart = async () => {
      try {
        if (!data || data.length === 0) {
          if (isMounted) setIsLoaded(true);
          return;
        }

        // ✅ Dynamic import - Vercel build me kaam karega
        const { createChart } = await import('lightweight-charts');

        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth || 600,
          height: height,
          layout: {
            background: { color: '#131722' },
            textColor: '#d1d4dc',
          },
          grid: {
            vertLines: { color: '#2a2f3a' },
            horzLines: { color: '#2a2f3a' },
          },
          crosshair: { mode: 0 },
          rightPriceScale: { borderColor: '#2a2f3a' },
          timeScale: {
            borderColor: '#2a2f3a',
            timeVisible: true,
            secondsVisible: false,
          },
        });

        chartRef.current = chart;

        const candleSeries = chart.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderDownColor: '#ef4444',
          borderUpColor: '#22c55e',
          wickDownColor: '#ef4444',
          wickUpColor: '#22c55e',
        });

        if (data && data.length > 0) {
          candleSeries.setData(data);
        }

        if (isMounted) setIsLoaded(true);

        const handleResize = () => {
          if (chartRef.current && chartContainerRef.current) {
            chartRef.current.resize(
              chartContainerRef.current.clientWidth,
              height
            );
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
        };

      } catch (err) {
        console.error('Chart error:', err);
        if (isMounted) {
          setError(err.message);
          setIsLoaded(true);
        }
      }
    };

    loadChart();

    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800 flex items-center justify-center" style={{ height }}>
        <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg overflow-hidden bg-[#131722] border border-red-800 flex items-center justify-center" style={{ height }}>
        <div className="text-red-400 text-sm text-center px-4">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800 flex items-center justify-center" style={{ height }}>
        <div className="text-gray-400 text-sm">📊 No data available</div>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800"
      style={{ height, minHeight: height }}
    />
  );
};

export default React.memo(CandleChart);