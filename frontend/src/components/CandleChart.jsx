// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from 'react';

const CandleChart = ({ data, height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [containerReady, setContainerReady] = useState(false);

  // ✅ Step 1: Check if container is ready
  useEffect(() => {
    if (chartContainerRef.current) {
      setContainerReady(true);
    }
  }, []);

  // ✅ Step 2: Load chart only when container is ready
  useEffect(() => {
    let isMounted = true;
    let loadTimeout = null;

    const loadChart = async () => {
      // ✅ Wait for container
      if (!containerReady || !chartContainerRef.current) {
        console.log('⏳ Waiting for container...');
        return;
      }

      // ✅ Check data
      if (!data || data.length === 0) {
        if (isMounted) {
          setIsLoaded(true);
        }
        return;
      }

      try {
        // ✅ Dynamic import
        const { createChart } = await import('lightweight-charts');

        if (!chartContainerRef.current) return;

        // ✅ Clear previous chart
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }

        // ✅ Get container width
        const width = chartContainerRef.current.clientWidth || 600;

        // ✅ Create chart
        const chart = createChart(chartContainerRef.current, {
          width: width,
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

        // ✅ Add candlestick series
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

    // ✅ Delay to ensure DOM is fully ready
    loadTimeout = setTimeout(() => {
      loadChart();
    }, 300);

    return () => {
      clearTimeout(loadTimeout);
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height, containerReady]);

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