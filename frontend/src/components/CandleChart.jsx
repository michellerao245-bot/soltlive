// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = ({ data, height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [containerReady, setContainerReady] = useState(false);

  // ✅ Check container ready
  useEffect(() => {
    if (chartContainerRef.current) {
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let chartInstance = null;
    let candleSeries = null;

    const loadChart = async () => {
      try {
        // ✅ Check if container is ready
        if (!containerReady || !chartContainerRef.current) {
          console.log('⏳ Container not ready yet');
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

        // ✅ Clear previous chart
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

        // ✅ Cleanup function
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

    // ✅ Small delay to ensure DOM is ready
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
        <div className="text-gray-400 text-sm">
          📊 No data available for this token
        </div>
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