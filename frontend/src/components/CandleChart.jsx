// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = ({ data, height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let chartInstance = null;
    let candleSeries = null;

    const loadChart = async () => {
      try {
        // ✅ Problem 2: Direct ref check (No containerReady required)
        if (!chartContainerRef.current) {
          return;
        }

        // ✅ Check if data exists
        if (!data || data.length === 0) {
          console.warn('📊 No data for chart');
          if (isMounted) {
            setIsLoaded(true);
          }
          return;
        }

        // ✅ Clear previous chart instance safely
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }

        // ✅ Get container width
        const containerWidth = chartContainerRef.current.clientWidth || 600;

        // ✅ Create chart
        chartInstance = createChart(chartContainerRef.current, {
          width: containerWidth,
          height: height,
          layout: {
            background: { color: '#131722' },
            textColor: '#d1d4dc',
          },
          grid: {
            vertLines: { color: '#2a2f3a' },
            horzLines: { color: '#2a2f3a' },
          },
          crosshair: {
            mode: 0,
          },
          rightPriceScale: {
            borderColor: '#2a2f3a',
          },
          timeScale: {
            borderColor: '#2a2f3a',
            timeVisible: true,
            secondsVisible: false,
          },
        });

        chartRef.current = chartInstance;

        // ✅ Add Candlestick Series
        candleSeries = chartInstance.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderDownColor: '#ef4444',
          borderUpColor: '#22c55e',
          wickDownColor: '#ef4444',
          wickUpColor: '#22c55e',
        });

        // ✅ Set data
        if (data && data.length > 0) {
          candleSeries.setData(data);
        }

        if (isMounted) {
          setIsLoaded(true);
          setError(null);
        }

        // ✅ Resize handler
        const handleResize = () => {
          if (chartRef.current && chartContainerRef.current) {
            chartRef.current.resize(
              chartContainerRef.current.clientWidth,
              height
            );
          }
        };

        window.addEventListener('resize', handleResize);

        // ✅ Cleanup function inside loadChart
        return () => {
          window.removeEventListener('resize', handleResize);
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
        };

      } catch (err) {
        console.error('❌ Chart loading error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load chart');
          setIsLoaded(true);
        }
      }
    };

    // ✅ Small delay to ensure DOM layout is completely painted
    const timer = setTimeout(() => {
      loadChart();
    }, 100);

    return () => {
      clearTimeout(timer);
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height]); // ✅ Problem 3: Clean Dependency Array

  // ✅ Error state (renders inside bounds)
  if (error) {
    return (
      <div
        className="w-full rounded-lg overflow-hidden bg-[#131722] border border-red-800 flex items-center justify-center"
        style={{ height: height }}
      >
        <div className="text-red-400 text-sm text-center px-4">
          <p>⚠️ {error}</p>
          <p className="text-gray-500 text-xs mt-1">Try selecting a different token</p>
        </div>
      </div>
    );
  }

  // ✅ No data state
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800 flex items-center justify-center"
        style={{ height: height }}
      >
        <div className="text-gray-400 text-sm">
          📊 No data available for this token
        </div>
      </div>
    );
  }

  // ✅ Fix Sabse Bada Bug: DOM Container remains present instantly!
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800"
      style={{ height }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131722] z-10 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
          <div className="text-gray-400 text-sm">Loading chart...</div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ minHeight: height }}
      />
    </div>
  );
};

export default React.memo(CandleChart);