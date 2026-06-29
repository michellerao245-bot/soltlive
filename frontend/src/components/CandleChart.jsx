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
        // ✅ Check data
        if (!data || data.length === 0) {
          if (isMounted) {
            setIsLoaded(true);
            setError('No data available');
          }
          return;
        }

        // ✅ Dynamic import with better error handling
        let createChart;
        try {
          const module = await import('lightweight-charts');
          createChart = module.createChart;
        } catch (importErr) {
          console.error('Import error:', importErr);
          // ✅ Fallback: try require
          try {
            const module = require('lightweight-charts');
            createChart = module.createChart || module.default?.createChart;
          } catch (requireErr) {
            throw new Error('Could not load chart library: ' + requireErr.message);
          }
        }

        if (!createChart) {
          throw new Error('createChart function not found');
        }

        if (!chartContainerRef.current) {
          throw new Error('Chart container not ready');
        }

        // ✅ Clear previous chart
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }

        // ✅ Get container width
        const containerWidth = chartContainerRef.current.clientWidth || 600;

        // ✅ Create chart
        const chart = createChart(chartContainerRef.current, {
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

        chartRef.current = chart;

        // ✅ Add Candlestick Series
        const candleSeries = chart.addCandlestickSeries({
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
          setError(err.message || 'Failed to load chart');
          setIsLoaded(true);
        }
      }
    };

    // ✅ Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadChart();
    }, 200);

    return () => {
      clearTimeout(timer);
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height]);

  // ✅ Loading state
  if (!isLoaded) {
    return (
      <div
        className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800 flex items-center justify-center"
        style={{ height: height }}
      >
        <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  // ✅ Error state
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
        <div className="text-gray-400 text-sm">📊 No data available</div>
      </div>
    );
  }

  // ✅ Chart container
  return (
    <div
      ref={chartContainerRef}
      className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800"
      style={{ height: height, minHeight: height }}
    />
  );
};

export default React.memo(CandleChart);